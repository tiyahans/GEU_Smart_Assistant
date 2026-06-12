import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "Student";
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/upload", label: "Upload PDF" },
    { path: "/chat", label: "Ask AI" },
    { path: "/history", label: "History" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">GEU <span className="accent-text">Smart Assistant</span></span>
        </Link>
        
        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-avatar" title={userName}>
            {userInitials}
          </div>
          <span className="user-name">{userName}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
