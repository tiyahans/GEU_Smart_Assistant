import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "success", "error", "uploading"
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setStatus("");
    setMessage("");
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setStatus("error");
      setMessage("Only PDF files are supported. Please select a valid academic PDF.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("error");
      setMessage("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setStatus("uploading");
    setMessage("Uploading file and saving metadata...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await API.post("/upload", formData);

      setStatus("success");
      setMessage(response.data.message || "File uploaded successfully!");
      setFile(null);

      // Redirect after brief delay so user sees success state
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-page-container">
      <Navbar />
      
      <main className="main-content">
        <div className="upload-wrapper">
          <div className="upload-header-text">
            <h2>Add Academic Documents</h2>
            <p>Upload lecture notes, journal articles, or course syllabi in PDF format to build your AI database.</p>
          </div>

          <div className="upload-card-container">
            <form onSubmit={handleUpload} onDragEnter={handleDrag} className="upload-form">
              <input
                ref={fileInputRef}
                type="file"
                className="file-input-hidden"
                accept=".pdf"
                onChange={handleChange}
              />

              <div 
                className={`drag-drop-zone ${dragActive ? "drag-active" : ""} ${file ? "has-file" : ""}`}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <div className="zone-content">
                  <span className="zone-icon">{file ? "📄" : "☁️"}</span>
                  {file ? (
                    <>
                      <h3 className="selected-filename">{file.name}</h3>
                      <p className="selected-filesize">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <span className="change-file-hint">Click or drag another file to change</span>
                    </>
                  ) : (
                    <>
                      <h3>Drag and drop your PDF here</h3>
                      <p>or click to browse your local files</p>
                      <span className="file-limits-hint">Maximum file size: 16 MB</span>
                    </>
                  )}
                </div>
              </div>

              {status === "uploading" && (
                <div className="upload-progress-container">
                  <div className="progress-bar-loading"></div>
                  <p className="upload-status-text text-info">{message}</p>
                </div>
              )}

              {status === "success" && (
                <div className="alert alert-success mt-15">{message}</div>
              )}

              {status === "error" && (
                <div className="alert alert-danger mt-15">{message}</div>
              )}

              <div className="upload-actions">
                <Link to="/dashboard" className="btn btn-outline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="btn btn-primary"
                >
                  {loading ? "Uploading..." : "Upload PDF"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Upload;
