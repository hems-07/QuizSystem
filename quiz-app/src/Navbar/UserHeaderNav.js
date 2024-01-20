import React from "react";
import { Link, useNavigate } from "react-router-dom";

const UserHeaderNav = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions
    
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <div className="navbar-brand">Quiz App</div>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="menu">
          <li className="nav-item">
            <Link className="nav-link" to="/user">
              Take Quiz
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/user/attempted_quiz">
              Show Results
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/user/feedback">
              Feedback
            </Link>
          </li>
            <li className="nav-item">
              {username && (
                <span className="nav-link">{username}!</span>
              )}
            </li>
          </ul>
          <div className="ml-auto" style ={{marginLeft:'700px'}}> {/* Add this div with ml-auto class */}
            <button
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserHeaderNav;