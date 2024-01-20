import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Axios from 'axios';
import UserHeaderNav from '../Navbar/UserHeaderNav';
import './QuestionQuiz.css';

function QuestionQuiz() {
    
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const location = useLocation();
  const [technology, setTechnology] = useState('');
  const [point,setPoint] = useState(0);
  const [emailid, setEmailId] = useState('');
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (location.state?.technology){
      //console.log(location.state.email);
      //setEmailId(location.state.email);
      setTechnology(location.state.technology);
    }
    if (location.state?.email){
      console.log(location.state.email);
      setEmailId(location.state.email);
      setUserName(location.state.userName);
    }
    if (location.state?.userId){
      setUserId(location.state.userId);
    }
    if (location.state?.quizId){
      setQuizId(location.state.quizId);
    }
  }, [location.state]);
  console.log("hi " + userName + userId + quizId);
  useEffect(() => {
    // Fetch questions based on the selected technology
    Axios.get(`http://localhost:8080/user/questions/${technology}`)
      .then((response) => {
        console.log("Questions" + response.data[0]);
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch questions: " + error);
      });
  }, [technology]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timer]);

  const handleAnswerSubmission = () => {
    const soln = questions[currentQuestionIndex].correct_answer_index;
    const correctOption = questions[currentQuestionIndex][`option${soln}`];
    console.log(selectedAnswer + " Selecting answer " + correctOption + "Here " + isCorrect);
  
    let curScore = 0; // Initialize the score variable
  
    if (selectedAnswer === correctOption) {
      setIsCorrect(true);
      curScore = 1; // Set the score to 1 if the answer is correct
      setPoint(point + 1);
    } else {
      setIsCorrect(false);
      curScore = 0; // Set the score to 0 if the answer is wrong
    }
    if (userId !== null) {
      console.log("Current Score " + curScore);
      const values = {
        userId: userId,
        questionId: questions[currentQuestionIndex].question_id,
        score: curScore, // Use the curScore variable here
        selectedOption: correctOption,
        quizId
      };
      console.log("Current Score " + curScore);
  
      Axios.post(`http://localhost:8080/user/result`, values)
        .then((response) => {
          console.log("Result validated!");
        })
        .catch((error) => {
          console.error("Failed to insert Results: " + error);
        });
    }
    handleSkipQuestion();
  };
  
  
  const handleSkipQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setTimer(5);
  };

  const handleFinishQuiz = () => {
    // Calculate and display the user's score or other relevant information
    Axios.post(`http://localhost:8080/user/finalResult/${point}`,{userId,quizId})
      .then((response) => {
        console.log("Finale Result validated!");
      
        setTimeout(() => {
          console.log(userId + "here in finale answer");
          navigate('/user',{state: {email: emailid, userName : userName, userId : userId}});
        },500)

      })
    
      .catch((error) => {
        console.error("Failed to insert Results: " + error);
      });

  };

  const handleSeeResults = () => {
    // Calculate and display the user's score or other relevant information
    Axios.post(`http://localhost:8080/user/finalResult/${point}`,{userId,quizId})
      .then((response) => {
        console.log("Finale Result validated!");
      
        setTimeout(() => {
          navigate('/user/attempted_quiz',{state: {email: emailid, userName : userName, userId : userId}});
        },500)
        
      })
    
      .catch((error) => {
        console.error("Failed to insert Results: " + error);
      });

  };

  const renderQuizContent = () => {
    if (timer === 0) {
      setSelectedAnswer(0);
      handleAnswerSubmission();
      if (currentQuestionIndex >= questions.length){
        handleFinishQuiz();
      }
      //handleSkipQuestion();
    }
    else if (currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      return (
        <div className = "QuizContent">
          <h2>Question {currentQuestionIndex + 1}</h2>
          <div className="Timer">
            <p style={{color: 'red'}}>Time left: </p><span style={{color: 'green'}}>{timer} seconds</span>
          <div className = "Question">
            <h1>{question.text}</h1>
          </div>
          <div className="Options">
            <div
              className={`Option ${
                selectedAnswer === question.option1 ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer(question.option1)}
            >
              {question.option1}
            </div>
            <div
              className={`Option ${
                selectedAnswer === question.option2 ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer(question.option2)}
            >
              {question.option2}
            </div>
            <div
              className={`Option ${
                selectedAnswer === question.option3 ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer(question.option3)}
            >
              {question.option3}
            </div>
            <div
              className={`Option ${
                selectedAnswer === question.option4 ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer(question.option4)}
            >
              {question.option4}
            </div>
          </div>
          </div>
          <div className = "Buttons">
            <button  className = "Buttons" onClick={handleAnswerSubmission}>Submit Answer</button>
          </div>
        </div>
      );
    } else {
      return (
        <>
        <div className = "QuizContent">
          <div>
            <h2>Final Result: {point}/{questions.length}</h2>
          </div>
          <div>
          <h2>Quiz Finished!</h2>
            {/* Display the user's score or other relevant information */}
            <button className = "Buttons " onClick={handleFinishQuiz}>Finish</button>
          </div>
          <div>
            {/* Display the user's results */}
            <button className = "Buttons " onClick={handleSeeResults}>See Results</button>
          </div>
        </div>
        </>
      );
    }
  };

  return (
    <div className="quiz-page-container">
        <UserHeaderNav username ={userName}/>
        <div className = "QuestionQuiz">
          <h1>Quiz Application</h1>
          {questions.length === 0 ? <p>Loading questions...</p> : renderQuizContent()}
      </div>
    </div>
  );
}

export default QuestionQuiz;
