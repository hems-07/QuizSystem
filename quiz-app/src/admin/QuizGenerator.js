import Axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { HeaderNav } from "../Navbar/HeaderNav";
import { UserContext } from '../teacher/CommonLayout';
import './QuizGenerator.css';


function QuizGenerator() {
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]); // List of selected question IDs

  const { email, userId, username } = useContext(UserContext);
  console.log(email);

  useEffect(() => {
    fetchTechnology();
  }, []);

  const [technologies, setTechnologies] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState("");

  const [availableQuestions, setAvailableQuestions] = useState([]);

  const fetchTechnology = async () => {
    try {
      const response = await Axios.get(`http://localhost:8080/admin/quizzes/${userId}`);
      const data = response.data;
      console.log(data);
      if (Array.isArray(data)) {
        const description = data.map((item) => item.description);
        setTechnologies(description);
      }
    } catch (error) {
      console.error("Failed to fetch data! " + error);
    }
  };

  const renderTechnologyBlocks = () => {
    return technologies.map((technology) => (
      <option key={technology} value={technology}>
        {technology}
      </option>
    ));
  };

  const handleAddQuestion = (question) => {
    // Check if the question already exists in the questions array
    //setQuestions([...questions, question]);
    console.log(question);
    if (!questions.some((q) => q.question_id === question.question_id)) {
      setQuestions([...questions, question]);
    } else {
      // Handle the case where the question is already in the array (e.g., display an error message)
      console.log("Question already added.");
    }
  };
  

  const handleRemoveQuestion = (question) => {
    const updatedQuestions = questions.filter((q) => q !== question);
    setQuestions(updatedQuestions);
  };

  const handleGenerateQuiz = async () => {
    // Here, you can send an API request to create the quiz with the selected questions
    // Use the quizName and questions state to create the quiz
    // You may want to handle the API request and response appropriately
    console.log(questions);
    if (questions.length === 0) {
      alert("Please select at least one question for the quiz.");
      return;
    }
  
    try {
      // Create a payload with quizName and questions
      const payload = {
        quizName: quizName,
        questions: questions.map((question) => question.question_id), // Assuming question objects have an 'id' property
      };
  
      // Send the payload to the server
      const response = await Axios.post(`http://localhost:8080/admin/create-quiz/${userId}`, payload);
  
      // Handle the response here, e.g., display a success message
      console.log("Quiz created successfully:", response.data);
  
      // Optionally, reset the form or clear the selected questions
      setQuizName("");
      setQuestions([]);
      setTechnologies([]);
      setSelectedTechnology("");
      setAvailableQuestions([]);
      fetchTechnology();
    } catch (error) {
      console.error("Failed to create the quiz: " + error);
      // Handle any error, e.g., display an error message
    }
  };

  const handleTechnologyChange = async (e) => {
    const selectedTech = e.target.value;
    setSelectedTechnology(selectedTech);
    try {
      const response = await Axios.get(`http://localhost:8080/technology/${selectedTech}`);
      const data = response.data;
      if (Array.isArray(data)) {
        setAvailableQuestions(data);
      }
    } catch (error) {
      console.error("Failed to fetch questions for the selected technology: " + error);
    }
  };

  return (
    <div>
      <HeaderNav username = {username}/>
      <div className="container">
        <h2 className="mt-3">Quiz Generator</h2>
        <div className="form-group">
          <h3 htmlFor="quizName" className="center-text">Quiz Name</h3>
          <input
            type="text"
            className="form-control round-input"
            id="quizName"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>
        <form className="mt-3">
          <div className="mb-3">
            <h3 className="center-text">Select Topic</h3>
            <select
              className="form-select round-input"
              id="selectedTechnology"
              value={selectedTechnology}
              onChange={handleTechnologyChange}
            >
              <option value="">Select</option>
              {renderTechnologyBlocks()}
            </select>
          </div>
        </form>

        <div>
          <h3 className="center-text">Available Questions</h3>
          <div  className="technology-block">
              {availableQuestions.map((question) => (
                <>
                <div className="technology-row">
                  <h5 key={question.id}>
                    {question.text}
                  </h5>
                  <button onClick={() => handleAddQuestion(question)} className="enter-button">
                    Add
                  </button>
                  </div>
                </>
              ))}
          </div>
        </div>

        <div>
          <h3 className="center-text">Selected Questions</h3>
          <div  className="technology-block">
            {questions.map((question) => (
              <>
              <div className="technology-row">
                <h5 key={question.id}>
                  {question.text}
                </h5>
                <button onClick={() => handleRemoveQuestion(question)} className="enter-button">
                  Remove
                </button>
                </div>
              </>
            ))}
          
          </div>
        </div>

        <button onClick={handleGenerateQuiz} className="btnG">
          Generate Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizGenerator;
