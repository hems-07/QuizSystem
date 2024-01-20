import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './HeaderNav.css'


export const HeaderNav = ({ username }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Perform logout actions

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg">
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="menu">
      <li className="nav-item">
        <Link className="nav-link" to="/admin">
          Add Question
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/show-question">
          Show Question
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/generate-quiz">
          Generate Quiz
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/show-quiz">
          Show Quiz
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/validate-answer">
          User Response
        </Link>
      </li>
      <li className="nav-item">
        {username && <span className="nav-link">{username}!</span>}
      </li>
    </ul>
    <div className="ml-auto" style ={{marginLeft:'540px'}}> {/* Add this div with ml-auto class */}
      <button
        className="btn btn-outline-light"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </div>
</nav>

  );
};
