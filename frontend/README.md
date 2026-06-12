# 🎓 GEU Smart Academic Assistant

An AI-powered Retrieval-Augmented Generation (RAG) academic workspace that enables students to upload study materials, textbook chapters, and lecture notes in PDF format and perform semantic search, ask questions, and receive intelligent answers using Google Gemini AI, LangChain, and ChromaDB.

---

## 📸 Application Screenshots

### 🔐 Login Page

![Login Page](docs/screenshot/login.png)

### 📝 Registration Page

![Register Page](docs/screenshot/register.png)

### 📊 Dashboard

![Dashboard](docs/screenshot/dashboard.png)

### 📂 PDF Upload

![PDF Upload](docs/screenshot/upload-pdf.png)

### 🤖 AI Chat Interface

![AI Chat](docs/screenshot/chat.png)

### 📜 Chat History

![Chat History](docs/screenshot/history.png)

---

## 🚀 Key Features

### 🔐 Secure Authentication

* User Registration & Login
* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes

### 📂 Document Management

* PDF Upload & Storage
* User-specific Document Repository
* Delete Uploaded Documents
* Background PDF Processing

### 🤖 AI-Powered Academic Assistant

* Retrieval-Augmented Generation (RAG)
* Semantic Search
* Question Answering using Gemini AI
* Context-Aware Responses
* Multi-Document Search

### 🧠 Vector Database Integration

* ChromaDB Vector Storage
* Gemini Embeddings
* Similarity Search
* Efficient Document Retrieval

### 📜 Learning History

* Store User Questions
* Store AI Responses
* View Previous Conversations
* Learning Timeline

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Flask
* Flask-SQLAlchemy
* Flask-JWT-Extended
* Flask-CORS
* bcrypt

### Database

* MySQL
* ChromaDB

### AI & RAG Stack

* Google Gemini AI
* LangChain
* Retrieval-Augmented Generation (RAG)
* Gemini Embeddings API
* RecursiveCharacterTextSplitter
* PyPDFLoader

---

## 🏗️ System Workflow

```text
User Uploads PDF
        ↓
PDF Text Extraction
        ↓
Text Chunking (LangChain)
        ↓
Gemini Embeddings
        ↓
ChromaDB Vector Storage
        ↓
Semantic Retrieval
        ↓
Gemini AI
        ↓
Answer Generation
        ↓
Chat History Stored in MySQL
```

---

## 📂 Project Structure

```bash
GEU_Smart_Assistant/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── requirements.txt
│   ├── uploads/
│   ├── chroma_db/
│   └── utils/
│       ├── chatbot.py
│       ├── pdf_loader.py
│       └── vector_store.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── screenshot/
│       ├── login.png
│       ├── register.png
│       ├── dashboard.png
│       ├── upload-pdf.png
│       ├── chat.png
│       └── history.png
│
├── data/
│   └── fullstacklab1.pdf
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

```env
GOOGLE_API_KEY=your_gemini_api_key

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=geu_smart_assistant

JWT_SECRET_KEY=your_secret_key
```

---

## 💻 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/tiyahans/GEU_Smart_Assistant.git
cd GEU_Smart_Assistant
```

---

### 2️⃣ Setup MySQL Database

```sql
CREATE DATABASE geu_smart_assistant;
```

---

### 3️⃣ Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run Flask server:

```bash
python app.py
```

Backend runs on:

```text
http://localhost:5001
```

---

### 4️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🔒 Security Features

* Password Hashing using bcrypt
* JWT Authentication
* Protected API Endpoints
* Environment Variable Management
* User-specific Document Access
* Secure Vector Database Retrieval

---

## 🎯 Future Enhancements

* AI Quiz Generation
* PDF Summarization
* Voice-Based Question Answering
* Multi-Language Support
* Cloud Deployment
* Collaborative Learning Workspace
* Mobile Application

---

## 👩‍💻 Developer

### Tiya Hans

**B.Tech Computer Science Engineering**
Graphic Era University

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

### Made using React, Flask, MySQL, Gemini AI, LangChain, ChromaDB & RAG.
