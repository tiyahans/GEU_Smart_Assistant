# 🎓 GEU Smart Academic Assistant

An AI-powered Retrieval-Augmented Generation (RAG) academic workspace that enables students to upload PDFs, perform semantic search, ask contextual questions, and receive intelligent answers using Google Gemini AI, LangChain, and ChromaDB.

---

## 📸 Application Screenshots

### 🔐 Login Page

![Login Page](docs/screenshots/login.png)

### 📝 Registration Page

![Register Page](docs/screenshots/register.png)

### 📊 Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### 📂 PDF Upload

![PDF Upload](docs/screenshots/upload-pdf.png)

### 🤖 AI Chat Interface

![AI Chat](docs/screenshots/chat.png)

### 📜 Chat History

![Chat History](docs/screenshots/history.png)

---

## 🏗️ System Architecture

![Architecture](docs/architecture.png)

### Workflow

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
Gemini Flash Lite
        ↓
Answer Generation
        ↓
Chat History Saved in MySQL
```

---

## 🚀 Key Features

* Secure JWT Authentication
* PDF Upload & Management
* Retrieval-Augmented Generation (RAG)
* LangChain Integration
* ChromaDB Vector Database
* Gemini AI Powered Question Answering
* Semantic Search Across Documents
* Multi-Document Query Support
* Chat History Tracking
* Responsive React Dashboard
* Automatic PDF Processing Pipeline
* Background Embedding Generation

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
* Flask-JWT-Extended
* Flask-CORS
* SQLAlchemy

### Database

* MySQL
* ChromaDB

### AI & RAG Stack

* Google Gemini AI
* LangChain
* Retrieval Augmented Generation (RAG)
* Gemini Embeddings API
* RecursiveCharacterTextSplitter
* PyPDFLoader

---

## 📂 Project Structure

```bash
GEU_Smart_Assistant/
├── backend/
├── frontend/
├── docs/
│   ├── architecture.png
│   └── screenshots/
│       ├── login.png
│       ├── register.png
│       ├── dashboard.png
│       ├── upload-pdf.png
│       ├── chat.png
│       └── history.png
└── README.md
```

---

## 🔒 Security Features

* Password Hashing using bcrypt
* JWT Authentication
* Protected API Routes
* Environment Variables Management
* User-specific Document Access
* Secure Vector Store Retrieval

---

## 🎯 Future Enhancements

* PDF Summarization
* AI Quiz Generation
* Voice-Based Question Answering
* Multi-Language Support
* Admin Dashboard
* Cloud Deployment
* Collaborative Learning Workspace

---

## 👩‍💻 Developer

**Tiya Hans**

B.Tech Computer Science Engineering
Graphic Era University

---

⭐ If you found this project useful, consider giving it a star on GitHub.
