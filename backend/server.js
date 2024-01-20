const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const oneDay = 3000 * 60 * 60 * 24;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'hemspalani@2003',
    resave: false,
    cookie: {maxAge: oneDay},
    saveUninitialized: false,
  }));
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'hemspalani@2003',
    database: 'quizsystem'
})
app.listen(8080,()=>{
    console.log('Running on port 8080')
})


/*
app.post('/signup', (req, res) => {
  //const { name, age, email, password } = req.body;
  console.log("Signing in");
  const sql2 = `INSERT INTO USERS (username,email,password,is_admin) values (?)`;
  const values = [
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.admin
  ]
  const email= req.body.email;
  connection.query(sql2, [values], (error, data) => {
    if (error) {
      console.error(error);
      return res.json({ error: 'Internal server error' });
    }
    // generate JWT token for the new user
    const token = jwt.sign({ email }, 'your_secret_key');
    res.json({ success: true, token });
  });
});

app.post('/login', (req, res) => {
    console.log("Got in");
    const values = [
        req.body.email,
        req.body.password,
    ]
    const sql = "SELECT * FROM USERS WHERE `EMAIL` = ? AND `PASSWORD` = ?";
    connection.query(sql, [req.body.email,req.body.password], (error, data) => {
      if (error) {
        console.error(error);
        return res.json({ error: 'Internal server error' });
      }
      console.log(data);
      if(data.length >0){
        console.log("Login successful");
        const email= data[0].email;
        const admin = data[0].is_admin;
        const userId = data[0].user_id;
        const userName = data[0].username;
        const token = jwt.sign({ email: email }, 'your_secret_key');
        console.log(token);
        console.log(email);
        console.log(admin);
        console.log(userId + " " + userName);
        res.status(200).json({ success: true, token, email: email, admin: admin, userId: userId, userName : userName });
      }
      else if(data.length === 0) {
        return res.json({ error: 'Invalid email or password' });
      }
    });
});

*/

app.post('/signup', (req, res) => {
  console.log("Signing in");
  // Generate a salt to use for hashing
  const saltRounds = 10;
  console.log(req.body.password[0]);
  // Hash the user's password
  bcrypt.hash(req.body.password[0], saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      return res.json({ error: 'Internal server error' });
    }

    const sql2 = `INSERT INTO USERS (username, email, password, is_admin) VALUES (?)`;
    const values = [
      req.body.username,
      req.body.email,
      hash,
      req.body.admin
    ];

    connection.query(sql2, [values], (error, data) => {
      if (error) {
        console.error(error);
        return res.json({ error: 'Internal server error' });
      }

      // Generate JWT token for the new user
      const token = jwt.sign({ email: req.body.email }, 'your_secret_key');

      res.json({ success: true, token });
    });
  });
});

app.post('/login', (req, res) => {
  console.log("Got in");
  const email = req.body.email;
  const enteredPassword = req.body.password;

  // Query the database to retrieve the hashed password
  const sql = "SELECT * FROM USERS WHERE `EMAIL` = ?";
  connection.query(sql, [email], (error, data) => {
    if (error) {
      console.error(error);
      return res.json({ error: 'Internal server error' });
    }

    if (data.length === 0) {
      return res.json({ error: 'Invalid email or password' });
    }

    const hashedPassword = data[0].password;
    const userId = data[0].user_id;
    const userName = data[0].username;
    console.log(hashedPassword);
    // Compare the entered password with the hashed password
    bcrypt.compare(enteredPassword[0], hashedPassword, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ error: 'Internal server error' });
      }

      if (result) {
        console.log("Login successful");
        const email = data[0].email;
        const admin = data[0].is_admin;

        // Generate JWT token for the user
        const token = jwt.sign({ email: email }, 'your_secret_key');

        res.status(200).json({
          success: true,
          token,
          email: email,
          admin: admin,
          userId: userId,
          userName: userName
        });
      } else {
        return res.json({ error: 'Invalid email or password' });
      }
    });
  });
});

app.post('/admin/create-quiz/:teacher_id', (req, res) => {
  console.log("adding quiz");
  const teacher_id = req.params.teacher_id;
  const quer = "INSERT INTO quizzes(`title`,`teacher_id`) VALUES (?,?)";
  const values = [req.body.quizName];
  console.log(values);

  connection.query(quer, [values,teacher_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json('Error'); // Return an error response
    }

    // If the query was successful, continue with additional queries
    const quer_select = "SELECT quiz_id from quizzes order by quiz_id desc limit 1";

    // Perform additional database operations
    connection.query(quer_select, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json('Error'); // Handle additional query errors
      }
      const quiz_id = result[0].quiz_id;
      console.log(quiz_id);
      
      const questionIds = req.body.questions;
      const insertValues = questionIds.map(questionId => [quiz_id, questionId]);
      console.log(insertValues);
      const quer1 = "INSERT INTO quiz_questions(`quiz_id`, `question_id`) VALUES ?";
      //const quiz_id = result.quiz_id;
      // Perform other database operations as needed
      
      connection.query(quer1, [insertValues], (err,res) => {
        if (err) {
          console.log(err);
          return res.status(500).json('Error'); // Handle additional query errors
        }
      })

      // Send a success response once all database operations are completed
      return res.status(200).json('Success');
    });
  });
});

app.post('/questions/addquestion/:userId',(req,res)=>{
  const teacherId = req.params.userId;
  console.log("Adding a question");   
  //const sql1= "INSERT INTO questions(`text`,`option1`,`option2`,`option3`,`option4`,`correct_answer_index`,`difficulty_level`,`quiz_id`,`description`, `teacher_id`) VALUES (?)";
  const sql1= "INSERT INTO questions(`text`,`option1`,`option2`,`option3`,`option4`,`correct_answer_index`,`difficulty_level`,`description`, `teacher_id`) VALUES (?)";
  const values = [
      req.body.question,
      req.body.option1,
      req.body.option2,
      req.body.option3,
      req.body.option4,
      req.body.correctSolution,
      req.body.difficultyLevel,
      //req.body.quiz_id,
      req.body.technology,
      teacherId
  ];
  console.log(values);
  connection.query(sql1,[values],(err,result)=>{
    console.log("HERE");
      if(err){
          console.log(err)
          return res.json('Error');
      }
      return res.json('Success');
  });
});

app.get('/questions/getAllQuestion/:teacher_id',(req,res)=>{
  //HERE
  const teacher_id = req.params.teacher_id;
  console.log(teacher_id);
  const sqld = "SELECT * from questions where teacher_id = ?";
  //console.log(teacher_id);
  connection.query(sqld,[teacher_id],(err,data)=>{
    if(err){
      console.log(err);
      return;
    }
    else{
      res.send(data);
    }
  });
});

app.get('/questions/getAllQuiz/:teacher_id',(req,res)=>{
  //HERE
  const teacher_id = req.params.teacher_id;
  console.log(teacher_id);
  const sqld = "select quiz_id, title from quizzes where teacher_id = ?";
  //console.log(teacher_id);
  connection.query(sqld,[teacher_id],(err,data)=>{
    if(err){
      console.log(err);
      return;
    }
    else{
      res.send(data);
    }
  });
});

app.delete("/questions/delete/:quizid",(req,res)=>{
  const quizids = req.params.quizid;
  const sqld = "DELETE FROM QUESTIONS WHERE QUESTION_ID = ?";
  connection.query(sqld,quizids,(err,result,fields)=>{
    if(err){
      console.log(err);
      return;
    }
    else{
       console.log("Deleted successfully");
       return res.status(200).json({ message: "Question deleted successfully" });
    }

  })
})

app.delete("/quiz/delete/:quizid",(req,res)=>{
  const quizids = req.params.quizid;
  const sqld = "DELETE FROM QUIZZES WHERE title = ?";
  connection.query(sqld,quizids,(err,result,fields)=>{
    if(err){
      console.log(err);
      return;
    }
    else{
       console.log("Deleted successfully");
       return res.status(200).json({ message: "Question deleted successfully" });
    }

  })
})

app.post("/questions/update/:questionid",(req,res) => {
  const question_id = req.params.questionid;
  console.log("Updating values");
  const quer = "UPDATE QUESTIONS SET TEXT= ?, OPTION1 =?, OPTION2 = ?, OPTION3= ?,OPTION4 = ?, CORRECT_ANSWER_INDEX = ? where QUESTION_ID = ?";
  const values=[
    req.body.text,
    req.body.option1,
    req.body.option2,
    req.body.option3,
    req.body.option4,
    req.body.correct_answer_index,
    question_id
  ];
  console.log("values is ",values);
  connection.query(quer,values,(err,result)=>{
    if(err){
        console.log(err);
        res.status(500).json({ error: 'Failed to update question' });
    }else{
    console.log("Value successfully updated");
    res.status(200).json({ message: 'Question updated successfully' });
    }
  });
});

app.get("/user/quizzes/:username", (req,res) => {
  const username = req.params.username;
  console.log("Getting in here "+username);
  const quer = "select quiz_id, title from quizzes where quiz_id not in (select quiz_id from results where user_id = ? ) group by title";
  connection.query(quer, [username],(err,data) => {
    if (err){
      res.status(500).json({ error: 'Failed to fetch quiz' });
    }
    else{
      console.log(data);
      res.send(data);
    }
  })
});

app.post('/dashboard/feedback',(req,res)=>{
  const values = [
    req.body.name,
    req.body.feedback
  ]
  console.log("Values is ",values)
  const sqlq = "INSERT INTO FEEDBACK (user_id,feed) VALUES (?)";
  connection.query(sqlq,[values],(err,data)=>{
    if(err){
      console.log("Error inserting");
      return res.json('Error');
    }else{
      console.log("Feedback given");
      return res.json('Success');
    }
  })
})

app.get("/admin/quizzes/:teacher_id", (req,res) => {
  const teacher_id = req.params.teacher_id;
  console.log("Getting in here");
  console.log(teacher_id);
  const quer = "select description from questions where teacher_id = ? group by description";
  connection.query(quer, [teacher_id],(err,data) => {
    if (err){
      res.status(500).json({ error: 'Failed to fetch quiz' });
    }
    else{
      console.log(data);
      res.send(data);
    }
  })
});

app.get("/technology/:selectedTech", (req,res) => {
  const technology = req.params.selectedTech;
  const quer = "SELECT question_id, text from questions where description = ?";
  connection.query(quer,technology, (err,data)=>{
    if(err){
      console.log(err);
      return;
    }
    else{
      console.log("Questions fetched successflly",data);
      res.send(data);
    }
  });
});

app.get("/user/questions/:technology", (req, res) => {
  const technology = req.params.technology;
  const quer = "select question_id, text, option1, option2, option3, option4, correct_answer_index, difficulty_level from questions where question_id in (select question_id from quiz_questions where quiz_id in (select quiz_id from quizzes where title like ?))";

  connection.query(quer,technology, (err,data) => {
    if(err){
      console.log(err);
      return;
    }
    else{
      console.log("Questions fetched successflly",data);
      res.send(data);
    }
  });
});

app.post("/user/result", (req,res) => { 
  const values = [
    req.body.userId,
    req.body.quizId,
    req.body.score,
    req.body.questionId,
    req.body.selectedOption
  ];
  const quer = "INSERT INTO user_quiz_results (user_id, quiz_id, score, question_id, selected_option) VALUES (?)";
  console.log(values);
  connection.query(quer, [values], (err, data) => {
    if(err){
      console.log(err)
      return res.json('Error');
    }
  return res.json('Success'); 
  })
});

app.post("/user/finalResult/:point", (req,res) => { 
  const point = req.params.point;
  const values = [
    req.body.userId,
    req.body.quizId,
    point
  ];
  const quer = "INSERT INTO results (user_id, quiz_id, score) VALUES (?)";
  console.log("Here+ " + values);
  connection.query(quer, [values], (err, data) => {
    if(err){
      console.log(err)
      return res.json('Error');
    }
  return res.json('Success'); 
  })
});

app.get("/admin/userResults/:teacher_id", (req, res) => {
  const teacherId = req.params.teacher_id;
  const quer = "SELECT result_id, username, title, score, timestamp, quiz_id FROM quizzes natural join results natural join users where teacher_id = ?";

  connection.query(quer, [teacherId],(err,data) => {
    if(err){
      console.log(err);
      return;
    }
    else{
      console.log("Results fetched successflly",data);
      res.send(data);
    }
  });
});

app.get("/user/userResults/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const quer = "SELECT result_id, username, title, score, timestamp, quiz_id FROM quizzes natural join results natural join users where user_id = ?";

  connection.query(quer, [userId],(err,data) => {
    if(err){
      console.log(err);
      return;
    }
    else{
      console.log("Results fetched successflly",data);
      res.send(data);
    }
  });
});

app.get("/admin/userResults/questions/:quiz_id/:username", (req, res) => {
  const quiz_id = req.params.quiz_id;
  const username = req.params.username;
  const quer = `SELECT
  u.username,
  q.text AS question_text,
  uqr.selected_option,
  CASE
      WHEN q.correct_answer_index = 1 THEN q.option1
      WHEN q.correct_answer_index = 2 THEN q.option2
      WHEN q.correct_answer_index = 3 THEN q.option3
      WHEN q.correct_answer_index = 4 THEN q.option4
      ELSE NULL
  END AS correct_option,
  uqr.score
FROM
  questions AS q
JOIN
  user_quiz_results AS uqr
ON
  q.question_id = uqr.question_id
JOIN
  users AS u
ON
  u.user_id = uqr.user_id
WHERE
  u.username = ?
  AND uqr.quiz_id = ?
`;
  connection.query(quer, [username,quiz_id],(err,data) => {
    if(err){
      console.log(err);
      return;
    }
    else{
      console.log("Questions fetched successflly",data);
      res.send(data);
    }
  });
});