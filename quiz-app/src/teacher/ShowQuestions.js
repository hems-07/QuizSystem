import Axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { HeaderNav } from "../Navbar/HeaderNav.js";
import EditQuestionModal from "./EditQuestionModal.js";
import { UserContext } from './CommonLayout';

function ShowQuestions() {
  
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const { email, userId, username } = useContext(UserContext);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(-1);

  console.log(userId + " " + email);

  useEffect(() => {
    fetchData();
  },[userId, username]);

  const fetchData = () => {
    console.log(userId, username);
    Axios.get(`http://localhost:8080/questions/getAllQuestion/${userId}`)
      .then((response) => {
        setValues(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteQuestion = (event, question_id) => {
    event.preventDefault();
    Axios.delete(`http://localhost:8080/questions/delete/${question_id}`)
      .then(() => {
        // After successful deletion, trigger a data fetch to update the component
        fetchData();
        // You can also add a delay before navigating (optional)
        setTimeout(() => {
          navigate('/admin/show-question', { state: { name: username } });
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditQuestion = (question, index) => {
    setSelectedQuestionIndex(index);
    setShowEditModal(true);
  };
  

  const handleUpdateQuestion = (updatedQuestion) => {
    console.log(updatedQuestion);
    Axios.post(
        `http://localhost:8080/questions/update/${updatedQuestion.question_id}`,
        updatedQuestion
      )
      .then(() => {
        setShowEditModal(false); // Close the edit model
        // Wait for a short period to allow the update to complete
        setTimeout(() => {
          fetchData(); // Fetch the updated data
          // You can also add a delay before navigating (optional)
          /*setTimeout(() => {
            navigate('/admin/show-question', { state: { name: modname } });
          }, 500);*/
        }, 1000); // Adjust the delay time as needed
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
    
  };

  return (
    <div>
      <HeaderNav username = {username}/>
      <div className="container">
        <h2 className="mt-4 mb-3">Show Questions</h2>
        {values.length > 0 ? (
          <table className="table technology-block">
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Option1</th>
                <th>Option2</th>
                <th>Option3</th>
                <th>Option4</th>
                <th>Correct Solution</th>
                <th>Technology</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {values.map((question, index) => (
                <React.Fragment key={question.question_id}>
                <tr key={question.question_id} technology-row>
                  <td>{question.question_id}</td>
                  <td>{question.text}</td>
                  <td>{question.option1}</td>
                  <td>{question.option2}</td>
                  <td>{question.option3}</td>
                  <td>{question.option4}</td>
                  <td>{question.correct_answer_index}</td>
                  <td>{question.description}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={(event) => handleDeleteQuestion(event, question.question_id)}
                    >
                      Delete
                    </button>{" "}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditQuestion(question, index)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No questions found</p>
        )}
        {showEditModal && selectedQuestionIndex >= 0 && (
                  <EditQuestionModal
                    question={values[selectedQuestionIndex]}
                    onUpdateQuestion={handleUpdateQuestion}
                    onClose={() => {
                      setShowEditModal(false);
                      setSelectedQuestionIndex(-1);
                    }}
                  />
        )}
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default ShowQuestions;
