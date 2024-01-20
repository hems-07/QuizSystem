import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import UserHeaderNav from "../Navbar/UserHeaderNav.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../teacher/CommonLayout';

function AttemptedQuizes() {
    
    const { email, userId, username } = useContext(UserContext);
    //const location = useLocation();
    //const navigate = useNavigate();
    //const [quizId, setQuizId] = useState(null);
    const [responses, setResponses] = useState([]);
    const [openPanelIndex, setOpenPanelIndex] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");

  console.log(email);

  useEffect(() => {
    fetchUserResponses(userId);
    console.log(userId);
  }, [userId]);

  function formatTimestamp(timestamp) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const formattedTimestamp = new Date(timestamp).toLocaleString('en-US', options);
    return formattedTimestamp;
  }


const fetchUserResponses = async (userId) => {
    //console.log(userId, username, "Hello folks")
    try {
      const response = await Axios.get(`http://localhost:8080/user/userResults/${userId}`);
      setResponses(response.data);
    } catch (error) {
      setError("Failed to fetch user responses");
    }
  };

  const fetchUserQuestions = async (quiz_id, username) => {
    try {
      const questions = await Axios.get(`http://localhost:8080/admin/userResults/questions/${quiz_id}/${username}`);
      setQuestions(questions.data);
    } catch (error) {
      setError("Failed to fetch user responses");
    }
  };

  const togglePanel = (quiz_id, username, index) => {
    if (openPanelIndex === index) {
      setOpenPanelIndex(null);
    } else {
      setOpenPanelIndex(index);
      fetchUserQuestions(quiz_id, username);
    }
  };

  return (
    <div className="quiz-page-container">
      <UserHeaderNav username={username} />
      <div className="container">
        <h2 className="mt-4 mb-3">User Responses</h2>
        {responses.length > 0 ? (
          <table className="table technology-block">
            <thead>
              <tr>
                <th>UserID</th>
                <th>User</th>
                <th>Quiz</th>
                <th>Total Score</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => (
                <React.Fragment key={response.result_id}>
                  <tr>
                    <td>{response.result_id}</td>
                    <td>{response.username}</td>
                    <td>{response.title}</td>
                    <td style={{color:"yellow"}}>{response.score}</td>
                    <td>{formatTimestamp(response.timestamp)}</td>
                    <td>
                      <Link onClick={() => togglePanel(response.quiz_id, response.username, index)}>
                        <FontAwesomeIcon icon={faAngleRight} />
                      </Link>
                    </td>
                  </tr>
                  {openPanelIndex === index && (
                    <tr>
                      <td colSpan="6">
                        <div className={`response-panel${openPanelIndex === index ? ' open' : ''}`}>
                          <table className="table technology-block">
                            <thead>
                              <tr>
                                <th>Question</th>
                                <th>Selected Option</th>
                                <th>Correct Option</th>
                                <th>Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {questions.map((question, questionIndex) => (
                                <tr key={questionIndex}>
                                  <td style={{color:"white"}}>{question.question_text}</td>
                                  <td style={{color:"white"}}>{question.selected_option}</td>
                                  <td style={{color:"white"}}>{question.correct_option}</td>
                                  <td  style={{color:"yellow"}}>{question.score}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No user responses found</p>
        )}
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
    </div>
  );
}
export default AttemptedQuizes;