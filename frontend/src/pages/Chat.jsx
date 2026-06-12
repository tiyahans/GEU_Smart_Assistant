import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Chat() {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetchFiles();
    
    // Auto-select file if passed in router state (e.g. from Dashboard click)
    if (location.state && location.state.fileId) {
      setSelectedFileId(location.state.fileId);
    }

    // Load a friendly initial message
    setMessages([
      {
        sender: "ai",
        text: "Hello! I am your GEU Smart Academic Assistant. Select a specific PDF in the sidebar or ask questions about all your uploaded documents.",
      },
    ]);
  }, [location.state]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchFiles = async () => {
    try {
      const response = await API.get("/files");
      setFiles(response.data.files);
    } catch (err) {
      console.error("Failed to load files", err);
    }
  };

  const handleDeleteFile = async (fileId, filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"? This will permanently remove the file and all its AI embeddings.`)) {
      try {
        await API.delete(`/files/${fileId}`);
        alert("File deleted successfully!");
        
        // Reset selection if the deleted file was active
        if (selectedFileId === fileId) {
          setSelectedFileId(null);
        }
        
        fetchFiles(); // refresh list
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete file.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuestion = input.trim();
    setInput("");
    setError("");
    
    // Add user message to log
    setMessages((prev) => [...prev, { sender: "user", text: userQuestion }]);
    setLoading(true);

    try {
      const response = await API.post("/chat", {
        question: userQuestion,
        file_id: selectedFileId,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.answer },
      ]);
    } catch (err) {
      setError("Failed to get response from AI. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I encountered an error while processing your request. Please check your network connection or verify that the document is ready.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedFileName = () => {
    if (!selectedFileId) return "All Uploaded Documents";
    const file = files.find((f) => f.id === selectedFileId);
    return file ? file.filename : "Selected Document";
  };

  return (
    <div className="chat-page-container">
      <Navbar />

      <main className="chat-layout">
        {/* Left Sidebar - Files Selection */}
        <aside className="chat-sidebar">
          <h3>Study Library</h3>
          <p className="sidebar-hint">Select context for your question:</p>
          
          <div className="sidebar-list">
            <button
              className={`sidebar-item ${selectedFileId === null ? "active" : ""}`}
              onClick={() => setSelectedFileId(null)}
            >
              <span className="item-icon">📚</span>
              <div className="item-details">
                <span className="item-title">All Documents</span>
                <span className="item-meta">Query everything at once</span>
              </div>
            </button>

            {files.map((file) => (
              <div key={file.id} className="sidebar-item-container">
                <button
                  className={`sidebar-item ${selectedFileId === file.id ? "active" : ""}`}
                  onClick={() => setSelectedFileId(file.id)}
                >
                  <span className="item-icon">📄</span>
                  <div className="item-details">
                    <span className="item-title" title={file.filename}>
                      {file.filename}
                    </span>
                    <span className="item-meta">PDF File</span>
                  </div>
                </button>
                <button
                  className="sidebar-item-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id, file.filename);
                  }}
                  title="Delete document"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Main Panel - Conversation */}
        <section className="chat-window">
          <header className="chat-window-header">
            <div className="header-status">
              <span className="pulse-indicator"></span>
              <h4>Active Chat Context: <span className="highlight-text">{getSelectedFileName()}</span></h4>
            </div>
          </header>

          <div className="chat-messages-log">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message-row ai">
                <div className="message-bubble thinking-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              placeholder={`Ask a question about ${getSelectedFileName()}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Chat;
