import Axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { HeaderNav } from "../Navbar/HeaderNav.js";
import { UserContext } from './CommonLayout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function ShowQuizes() {
  
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState([]); // Rename values to technologies
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const { email, userId, username } = useContext(UserContext);
  const [searchText, setSearchText] = useState('');
  const [quizId, setQuizId] = useState([]); // Change quizId to an array to match the map function
  console.log(userId + " " + email);

  useEffect(() => {
    fetchData(userId);
  }, [userId, username]);

  const fetchData = async (userId) => {
    console.log(userId, username);
    Axios.get(`http://localhost:8080/questions/getAllQuiz/${userId}`)
      .then((response) => {
        setTechnologies(response.data.map(quiz => quiz.title)); // Use map to extract titles
        setQuizId(response.data.map(quiz => quiz.quiz_id)); // Extract quiz_ids
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderTechnologyBlocks = () => {
    // Filter technologies based on the search input
    const filteredTechnologies = technologies.filter((technology) =>
      technology.toLowerCase().includes(searchText.toLowerCase())
    );
  
    if (filteredTechnologies.length === 0) {
      return <p>No matching technologies found.</p>;
    }
  
    return filteredTechnologies.map((technology, index) => (
      <div key={index} className="technology-block" style={{ marginBottom: '20px' }}>
        <div className="technology-row">
          <h3>{technology}</h3>
          <button
            onClick={() => deleteQuiz(technology, quizId)}
          >
            Delete Quiz
          </button>
        </div>
      </div>
    ));
  };

  const deleteQuiz = (quiz_id) => {
    Axios.delete(`http://localhost:8080/quiz/delete/${quiz_id}`)
      .then(() => {
        // After successful deletion, trigger a data fetch to update the component
        fetchData();
        // You can also add a delay before navigating (optional)
        setTimeout(() => {
          navigate('/admin/show-quiz', { state: { name: username, userId: userId } });
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <HeaderNav username={username} />
      <div className="container">
        <div className="box">
          <form name="search">
            <input
              type="text"
              className="input"
              placeholder="Search Quiz"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </form>
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        {renderTechnologyBlocks()}
      </div>
    </div>
  );
};

export default ShowQuizes;
