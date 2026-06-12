# GEU Smart Academic Assistant

An AI-powered Retrieval-Augmented Generation (RAG) academic workspace designed to help students upload study materials, textbook chapters, and lecture notes in PDF format and run semantic queries, summarize documents, and log learning timeline logs.

---

## 🚀 Key Features

*   **Secure Authentication**: Student registration and login system protected with `bcrypt` password hashing and stateful JSON Web Tokens (JWT).
*   **Asynchronous Document Ingestion**: Instantly returns upload feedback while extracting text (`PyPDFLoader`), segmenting pages (`RecursiveCharacterTextSplitter`), and indexing vectors in the background using multi-threaded execution.
*   **Vector Database Persistence**: Connects to ChromaDB to persist mathematical representations of text chunks locally.
*   **Grounded RAG Chat Interface**: Uses LangChain pipelines to search vector documents and synthesize contextual answers using Google's **Gemini Flash Lite** LLM.
*   **Flexible Context Scopes**: Switch query contexts in the sidebar between querying a single selected PDF or search-indexing across **"All Documents"** (using dynamic `k=12` retrieval).
*   **Graceful Scanned Document Handling**: Detects empty or scanned image PDFs, indexing placeholder warnings instead of crashing to advise the user on document types.
*   **Integrated Document Manager**: Option to delete uploaded PDFs, performing a clean sweep to delete files from disk, remove SQL metadata rows, and purge matching vector embeddings from ChromaDB.
*   **Query Timelines**: Review and query timeline logs displaying collapsible cards containing timestamp tags and one-click clipboard copying.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite SPA framework), React Router (routing guards), Axios (API client + interceptors), Vanilla CSS (purple glassmorphism theme).
*   **Backend**: Python Flask, Flask-SQLAlchemy (MySQL ORM), Flask-JWT-Extended (security).
*   **Database Tier**: MySQL (relational metadata, credentials, and timeline logs), ChromaDB (vector database).
*   **AI Stack**: LangChain, Google Generative AI Embeddings (`models/gemini-embedding-2`), ChatGoogleGenerativeAI (`models/gemini-flash-lite-latest`).

---

## 📁 Project Directory Structure

```
GEU_Smart_Assistant/
├── backend/                       # Python Flask API Server
│   ├── app.py                     # Main application routing and business logic
│   ├── config.py                  # Environment config parser
│   ├── models.py                  # Database tables (SQLAlchemy models)
│   ├── requirements.txt           # Python backend dependencies
│   ├── .env                       # Environment secrets (ignored in Git)
│   ├── chroma_db/                 # Local ChromaDB vector database directory
│   ├── uploads/                   # Local physical user PDF storage
│   └── utils/                     # Extraction & RAG utilities
│       ├── chatbot.py             # LangChain QA chain creator
│       ├── pdf_loader.py          # PyPDF loader wrapper
│       └── vector_store.py        # Segmentation & embedding pipeline
└── frontend/                      # React SPA Client (Vite)
    ├── index.html                 # DOM entry point
    ├── vite.config.js             # Vite build configurations
    └── src/
        ├── main.jsx               # React initialization script
        ├── App.jsx                # Router & security guards
        ├── index.css              # Glassmorphic stylesheet
        ├── components/
        │   └── Navbar.jsx         # Global navigation bar component
        ├── services/
        │   └── api.js             # Axios client with JWT request/response interceptors
        └── pages/                 # SPA view screens
            ├── Login.jsx          # Login portal
            ├── Register.jsx       # Account registration portal
            ├── Dashboard.jsx      # File repository board
            ├── Upload.jsx         # PDF file dropzone
            ├── Chat.jsx           # Sidebar context selector & RAG conversation workspace
            └── ChatHistory.jsx    # Learning timeline search page
```

---

## ⚙️ Environment Configurations

Create a `.env` file inside the `backend/` folder:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=geu_smart_assistant
```

---

## 💻 Installation & Setup

### 1. Database Setup
1. Start your local MySQL instance.
2. Create a new database:
   ```sql
   CREATE DATABASE geu_smart_assistant;
   ```

### 2. Backend Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   python app.py
   ```
   *The server runs on `http://localhost:5001`. Tables will be created automatically in MySQL on startup.*

### 3. Frontend Installation
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to the URL shown in terminal (typically `http://localhost:5173`).*

---

## 🔒 Security & Git Recommendations
To keep your API keys and credentials secure, the `.env` file is excluded from git tracking. If `.env` is currently tracked, run:
```bash
git rm --cached backend/.env
git commit -m "Untrack local .env file"
```
Verify that the `backend/uploads/` and `backend/chroma_db/` folders are also untracked in your `.gitignore` file.
