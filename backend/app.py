from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask_cors import CORS
from models import db, User, UploadedFile, ChatHistory
from config import Config
import bcrypt
import os
from werkzeug.utils import secure_filename
import threading
from utils.pdf_loader import load_pdf
from utils.vector_store import create_vector_store
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA

app = Flask(__name__)

# Load Configuration
app.config.from_object(Config)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = "geu_smart_assistant_secret_key"

jwt = JWTManager(app)

# Initialize Database
db.init_app(app)

# Enable CORS
CORS(app)

# Database Connection Check
with app.app_context():
    db.create_all()
    print("Database Connected Successfully!")

# Home Route
@app.route("/")
def home():
    return jsonify({
        "message": "GEU Smart Assistant Backend Running"
    })

# Register Route
@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data["name"]
    email = data["email"]
    password = data["password"]

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    new_user = User(
        name=name,
        email=email,
        password=hashed_password.decode("utf-8")
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User Registered Successfully"
    }), 201


# Login Route
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if bcrypt.checkpw(
        password.encode("utf-8"),
        user.password.encode("utf-8")
    ):

        access_token = create_access_token(
            identity=user.email
        )

        return jsonify({
            "message": "Login Successful",
            "token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200

    return jsonify({
        "message": "Invalid Password"
    }), 401


# Protected Profile Route
@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    current_user = get_jwt_identity()

    return jsonify({
        "message": "Authorized User",
        "email": current_user
    })


def process_pdf_in_background(filepath, user_id, file_id):
    with app.app_context():
        try:
            print(f"Starting background PDF ingestion for file {file_id}...", flush=True)
            # 1. Load PDF using PyPDFLoader
            documents = load_pdf(filepath)
            
            # 2. Add user_id and file_id metadata to each document chunk
            for doc in documents:
                doc.metadata['user_id'] = user_id
                doc.metadata['file_id'] = file_id
                
            # 3. Split text and generate vector store in ChromaDB
            create_vector_store(documents)
            print(f"Background PDF ingestion completed successfully for file {file_id}!", flush=True)
        except Exception as e:
            print(f"Error in background PDF ingestion for file {file_id}: {e}", flush=True)


# Upload PDF API
@app.route("/upload", methods=["POST"])
@jwt_required()
def upload_file():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No file selected for uploading"}), 400
    
    if file and file.filename.lower().endswith('.pdf'):
        filename = secure_filename(file.filename)
        # Store in user-specific subfolder to avoid name collisions
        user_upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], str(user.id))
        os.makedirs(user_upload_dir, exist_ok=True)
        
        filepath = os.path.join(user_upload_dir, filename)
        file.save(filepath)
        
        # Save file metadata in MySQL
        new_file = UploadedFile(
            user_id=user.id,
            filename=filename,
            filepath=filepath
        )
        db.session.add(new_file)
        db.session.commit()
        
        # Trigger vector store creation in background thread
        thread = threading.Thread(
            target=process_pdf_in_background,
            args=(filepath, user.id, new_file.id)
        )
        thread.start()
        
        return jsonify({
            "message": "File uploaded successfully. Processing started.",
            "file": {
                "id": new_file.id,
                "filename": new_file.filename,
                "upload_time": new_file.upload_time.strftime("%Y-%m-%d %H:%M:%S")
            }
        }), 201
    
    return jsonify({"message": "Allowed file types are PDF only"}), 400


# Get User Files API
@app.route("/files", methods=["GET"])
@jwt_required()
def get_files():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    files = UploadedFile.query.filter_by(user_id=user.id).order_by(UploadedFile.upload_time.desc()).all()
    files_list = []
    for f in files:
        files_list.append({
            "id": f.id,
            "filename": f.filename,
            "upload_time": f.upload_time.strftime("%Y-%m-%d %H:%M:%S")
        })
        
    return jsonify({"files": files_list}), 200


# Delete PDF File API
@app.route("/files/<int:file_id>", methods=["DELETE"])
@jwt_required()
def delete_file(file_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Find the file in MySQL
    file_record = UploadedFile.query.filter_by(id=file_id, user_id=user.id).first()
    if not file_record:
        return jsonify({"message": "File not found or unauthorized"}), 404

    try:
        # 1. Delete physical file from disk
        if os.path.exists(file_record.filepath):
            os.remove(file_record.filepath)
        
        # 2. Delete metadata from MySQL
        db.session.delete(file_record)
        db.session.commit()

        # 3. Delete embeddings from ChromaDB
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-2"
        )
        chroma_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'chroma_db')
        if os.path.exists(chroma_dir):
            vector_db = Chroma(
                persist_directory=chroma_dir,
                embedding_function=embeddings
            )
            # Delete by metadata filter
            vector_db.delete(where={"file_id": int(file_id)})

        return jsonify({"message": "File and its AI index deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting file {file_id}: {e}")
        return jsonify({"message": f"Failed to delete file: {str(e)}"}), 500



# Chat with AI RAG API
@app.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"message": "Missing 'question' parameter"}), 400

    question = data['question']
    file_id = data.get('file_id')  # optional filter

    try:
        # Load ChromaDB vector store
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-2"
        )
        
        # If the chroma_db folder doesn't exist yet, it means no embeddings have been created at all
        chroma_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'chroma_db')
        if not os.path.exists(chroma_dir):
            return jsonify({"answer": "No documents uploaded or processed yet. Please upload a PDF first."}), 200

        vector_db = Chroma(
            persist_directory=chroma_dir,
            embedding_function=embeddings
        )

        # Set up retrieval filter and dynamic chunk retrieval limit (k)
        if file_id:
            # Check if this file exists and belongs to the user
            file_record = UploadedFile.query.filter_by(id=file_id, user_id=user.id).first()
            if not file_record:
                return jsonify({"message": "File not found or unauthorized"}), 404
            
            search_filter = {"file_id": int(file_id)}
            k_val = 4  # Focus context limit for a single document
        else:
            search_filter = {"user_id": int(user.id)}
            k_val = 12  # Retrieve more context to cover multiple files

        retriever = vector_db.as_retriever(
            search_kwargs={"filter": search_filter, "k": k_val}
        )

        # Initialize LLM (Gemini Flash Lite)
        llm = ChatGoogleGenerativeAI(
            model="gemini-flash-lite-latest",
            temperature=0.3
        )

        # Run Retrieval QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever
        )

        response = qa_chain.invoke({"query": question})
        answer = response.get("result", "I could not find an answer in the provided documents.")

        # Save query and answer in MySQL chat_history table
        new_chat = ChatHistory(
            user_id=user.id,
            question=question,
            answer=answer
        )
        db.session.add(new_chat)
        db.session.commit()

        return jsonify({
            "answer": answer,
            "chat_id": new_chat.id
        }), 200

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"message": f"Error running AI query: {str(e)}"}), 500


# Get Chat History API
@app.route("/history", methods=["GET"])
@jwt_required()
def get_chat_history():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    history = ChatHistory.query.filter_by(user_id=user.id).order_by(ChatHistory.timestamp.desc()).all()
    history_list = []
    for h in history:
        history_list.append({
            "id": h.id,
            "question": h.question,
            "answer": h.answer,
            "timestamp": h.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })

    return jsonify({"history": history_list}), 200



if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        debug=True,
        port=5001
    )