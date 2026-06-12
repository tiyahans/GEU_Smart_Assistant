import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await API.get("/files");
      setFiles(response.data.files);
    } catch (err) {
      setError("Failed to fetch uploaded files. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId, filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"? This will permanently remove the file and all its AI embeddings.`)) {
      try {
        await API.delete(`/files/${fileId}`);
        alert("File deleted successfully!");
        fetchFiles(); // refresh list
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete file.");
      }
    }
  };

  const filteredFiles = files.filter(file => 
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="main-content">
        <header className="content-header">
          <div className="welcome-banner">
            <h1>Academic Document Repository</h1>
            <p>Upload your syllabus, lecture notes, and research PDFs to ask questions and generate summaries.</p>
          </div>
        </header>

        <section className="dashboard-grid">
          {/* Quick Action Card 1: Upload */}
          <div className="action-card upload-card-shortcut">
            <span className="card-icon">📤</span>
            <h3>Upload Documents</h3>
            <p>Import new study materials in PDF format to start analyzing.</p>
            <Link to="/upload" className="btn btn-accent btn-sm">
              Upload Files
            </Link>
          </div>

          {/* Quick Action Card 2: Chat */}
          <div className="action-card chat-card-shortcut">
            <span className="card-icon">🤖</span>
            <h3>Ask Assistant</h3>
            <p>Run semantic queries on your uploaded textbook chapters or PDFs.</p>
            <Link to="/chat" className="btn btn-accent btn-sm">
              Start Chatting
            </Link>
          </div>
        </section>

        <section className="files-section">
          <div className="section-header">
            <h2>Your Uploaded Documents</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search documents by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching files from database...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredFiles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              {searchQuery ? (
                <>
                  <h3>No matches found</h3>
                  <p>Try searching for a different keyword or file name.</p>
                </>
              ) : (
                <>
                  <h3>No documents uploaded yet</h3>
                  <p>You haven't uploaded any study materials. Drag & drop your first PDF now!</p>
                  <Link to="/upload" className="btn btn-primary">
                    Upload PDF
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="files-grid">
              {filteredFiles.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="file-card-header">
                    <span className="pdf-icon">📄</span>
                    <span className="file-badge">PDF</span>
                  </div>
                  <div className="file-card-body">
                    <h4 className="file-name" title={file.filename}>
                      {file.filename}
                    </h4>
                    <p className="file-date">
                      Uploaded on: {file.upload_time}
                    </p>
                  </div>
                  <div className="file-card-footer card-actions-row">
                    <button 
                      className="btn btn-outline btn-sm flex-grow-1"
                      onClick={() => navigate("/chat", { state: { fileId: file.id } })}
                    >
                      Analyze with AI
                    </button>
                    <button 
                      className="btn btn-danger-outline btn-icon-only btn-sm"
                      onClick={() => handleDeleteFile(file.id, file.filename)}
                      title="Delete document"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
