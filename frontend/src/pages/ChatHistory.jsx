import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function ChatHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get("/history");
      setHistory(response.data.history);
    } catch (err) {
      setError("Failed to retrieve query logs. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(
    (h) =>
      h.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Answer copied to clipboard!");
  };

  return (
    <div className="history-page-container">
      <Navbar />

      <main className="main-content">
        <header className="content-header">
          <div className="welcome-banner">
            <h1>Learning History Log</h1>
            <p>Review and search through all your previous AI queries, notes, and academic summaries.</p>
          </div>
        </header>

        <section className="history-section">
          <div className="section-header">
            <h2>Query Sessions</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search history content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your learning log...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📜</div>
              {searchQuery ? (
                <>
                  <h3>No matches found</h3>
                  <p>Try searching for different keywords.</p>
                </>
              ) : (
                <>
                  <h3>No session logs recorded</h3>
                  <p>You haven't asked the assistant any questions yet. Go to the Chat interface to begin!</p>
                </>
              )}
            </div>
          ) : (
            <div className="history-timeline">
              {filteredHistory.map((item) => (
                <div key={item.id} className="history-card">
                  <div className="history-card-header">
                    <span className="timestamp-badge">📅 {item.timestamp}</span>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(item.answer)}
                      title="Copy answer"
                    >
                      📋 Copy
                    </button>
                  </div>
                  
                  <div className="history-card-body">
                    <div className="question-block">
                      <span className="block-label">Question:</span>
                      <p className="question-text">{item.question}</p>
                    </div>
                    
                    <div className="answer-block">
                      <span className="block-label">AI Response:</span>
                      <p className="answer-text">{item.answer}</p>
                    </div>
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

export default ChatHistory;
