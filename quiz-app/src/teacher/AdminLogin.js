import React, { useState, useContext } from "react";
import Axios from "axios";
import { HeaderNav } from "../Navbar/HeaderNav";
//import { useLocation } from "react-router-dom";
import { UserContext } from './CommonLayout';
import ValidationEvent from "../Forms/LoginValidation"
import './AdminLogin.css';

const AdminLogin = () => {

 // const location = useLocation();
  const { email, userId, username } = useContext(UserContext);
  
  const [values, setValues] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctSolution: '',
    difficultyLevel: '',
    //quiz_id: '',
    technology: '',
  });
  
  /*
  useEffect(() => {
    if (location.state?.email){
      setEmail(location.state.email);
      setUsername(location.state.userName);
    }
    if (location.state?.userId){
      setUserId(location.state.userId);
    }
  }, [location.state]);
  console.log("user ID " + userId);
  */

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(ValidationEvent(values));
    console.log(email);
    const difficultyLevelAsInt = parseInt(values.difficultyLevel);
    /*
    const newQuestion = {
      questionText: question,
      option1: option1,
      option2: option2,
      option3: option3,
      option4: option4,
      correctOption: parseInt(correctSolution),
      technology: technology,
    };

    <h4 className="center-text">Quiz ID</h4>
          <input
            type="text"
            className="form-control round-input"
            value={values.quiz_id}
            name="quiz_id"
            onChange={handleInput}
          />
          {errors.quiz_id && <span className="text-danger">{errors.quiz_id}</span>}
    */

    try {
      console.log(userId + " <- ");
      Axios.post(`http://localhost:8080/questions/addquestion/${userId}`,{...values, difficultyLevel: difficultyLevelAsInt,})
      .then(res => {
        console.log("Result's data is ",res.data);
        if(res.data === "Success"){
            // Handle success, e.g., display a success message or update the question list
          console.log("Question added successfully");
          setValues({
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctSolution: '',
            difficultyLevel: '',
            //quiz_id: '',
            technology: ''
          });
      }else{
          alert("Invalid credentials");
          console.log(values);
      }
      })
      

    } catch (error) {
      setErrors({ message: "Failed to add question" });
    }
  }
  const handleInput = (e) => {
    console.log(e.target.name, e.target.value);
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, // Remove the array wrapper []
    }));
  };
  

  return (
    <div>
      <HeaderNav username={username} />
      <div className="container technology-block" style={{marginTop: '10px', marginBottom: '10px'}}>
        <form onSubmit={handleSubmit} className="question-form">
          <h3 className="center-text">Question</h3>
          <input
            type="text"
            className="form-control round-input"
            placeholder="Enter Question"
            value={values.question}
            name="question"
            onChange={handleInput}
          />
          {errors.question && <span className="text-danger">{errors.question}</span>}

          <h4 className="center-text">Options</h4>
          <input
            type="text"
            className="form-control round-input"
            placeholder="Option 1"
            value={values.option1}
            name="option1"
            onChange={handleInput}
          />
          {errors.option1 && <span className="text-danger">{errors.option1}</span>}
          <input
            type="text"
            className="form-control round-input"
            placeholder="Option 2"
            value={values.option2}
            name="option2"
            onChange={handleInput}
          />
          {errors.option2 && <span className="text-danger">{errors.option2}</span>}
          <input
            type="text"
            className="form-control round-input"
            placeholder="Option 3"
            value={values.option3}
            name="option3"
            onChange={handleInput}
          />
          {errors.option3 && <span className="text-danger">{errors.option3}</span>}
          <input
            type="text"
            className="form-control round-input"
            placeholder="Option 4"
            value={values.option4}
            name="option4"
            onChange={handleInput}
          />
          {errors.option4 && <span className="text-danger">{errors.option4}</span>}

          <h4 className="center-text">Correct Solution</h4>
          <select
            className="form-control round-input"
            name="correctSolution"
            value={values.correctSolution}
            onChange={handleInput}
          >
            <option value="">Select Correct Solution</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
            <option value="4">Option 4</option>
          </select>
          {errors.correctSolution && <span className="text-danger">{errors.correctSolution}</span>}

          <h4 className="center-text">Difficulty Level</h4>
          <select
            className="form-control round-input"
            name="difficultyLevel"
            value={values.difficultyLevel}
            onChange={handleInput}
          >
            <option value="">Select Difficulty Level</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
          {errors.difficultyLevel && <span className="text-danger">{errors.difficultyLevel}</span>}

          <h4 className="center-text">Description</h4>
          <input
            type="text"
            className="form-control round-input"
            placeholder="Enter Type"
            value={values.technology}
            name="technology"
            onChange={handleInput}
          />
          {errors.technology && <span className="text-danger">{errors.technology}</span>}

          <button type="submit" className="btn-primary center-button grow-on-hover" style={{ marginTop: '30px', marginBottom: '50px !important'}}>
            Add Question
          </button>
          {errors.message && <div className="text-danger mt-2">{errors.message}</div>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
