import UserHeaderNav from "../Navbar/UserHeaderNav.js";
import Axios from "axios";
import {useNavigate} from 'react-router-dom';
import React, { useEffect, useState, useContext } from "react";
import './QuizPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../teacher/CommonLayout';

function QuizPage () {

  const navigate = useNavigate();
  const { email, userId, username } = useContext(UserContext);
  const [quizId, setQuizId] = useState(null);
  const [searchText, setSearchText] = useState('');

  //console.log("mail is" +location.state.email);
  useEffect(() => {
    fetchTechnology(userId);
  }, [userId]);

  const [technologies, setTechnologies] = useState([]);

  const fetchTechnology = async (userId) => {
    try {
      
      console.log("See ya "+username);
      const response = await Axios.get(`http://localhost:8080/user/quizzes/${userId}`);
      const data = response.data;
      if (Array.isArray(data)) {
        const description = data.map(item => item.title);
        const quiz_id = data.map(item=> item.quiz_id);
        console.log(quiz_id+"here");
        setTechnologies(description);
        setQuizId(quiz_id);
      }
    } catch (error) {
      console.error("Failed to fetch data!" + error);
    }

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
            onClick={() => enterQuiz(technology, quizId[index])}
          >
            Enter Quiz
          </button>
        </div>
      </div>
    ));
  };
  
  
  

  const enterQuiz = (selectedTechnology, curQuizId) => {  
    console.log("Look at quizD: " + curQuizId);
    setTimeout(() => {
      navigate('/user/question_quiz',{state: {email: email, technology: selectedTechnology, userName : username, userId : userId, quizId : curQuizId}});
    },500)
    console.log(`Entering quiz for ${selectedTechnology}`);
  };

  return (
    <div>
      <UserHeaderNav username={username} />
      <br></br>
      <br></br>
      <br></br>
      <div className="container">
        <h1 >Welcome {username}</h1>
        <div class="box">
          <form name="search">
            <input
              type="text"
              class="input"
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

export default QuizPage;
