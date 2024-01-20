import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
//import Login from "./Login";
import AdminLogin from "./teacher/AdminLogin";
import TryLogin from "./Forms/TryLogin";
import Signup from "./Forms/signup";
import QuizGenerator from "./admin/QuizGenerator";
import GlobalStyle from './globalStyles';
import Home from "./pages/Home";
import QuizPage from "./user/QuizPage";
import ShowQuestions from "./teacher/ShowQuestions";
import ShowUserResponse from "./teacher/ShowUserResponse";
import QuestionQuiz from  "./user/QuestionQuiz";
import CommonLayout from './teacher/CommonLayout';
import AttemptedQuizes from "./user/AttemptedQuizes";
import ShowQuizes from "./teacher/ShowQuizes";
import Feedback from "./user/Feedback";

const App = () => {
  return (

    <Router>
      
      <GlobalStyle/>
      <CommonLayout>
      <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route path="/login" element={<TryLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/user" element={<QuizPage />} />
        <Route path="/user/feedback" element={<Feedback />} />
        <Route path="/user/attempted_quiz" element={<AttemptedQuizes />} />
        <Route path="/user/question_quiz" element={<QuestionQuiz />} />
        <Route path="/admin/show-question" element={<ShowQuestions />} />
        <Route path="/admin/generate-quiz" element={<QuizGenerator />} />
        <Route path="/admin/validate-answer" element={<ShowUserResponse />} />
        <Route path="/admin/show-quiz" element={<ShowQuizes />} />
      </Routes>
      </CommonLayout>
    </Router>

  );
};

export default App;
