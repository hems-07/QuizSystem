import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import validation from './LoginValidation';
import Axios from 'axios';
import './TryLogin.css';

function TeacherLogin() {
    const [values, setValues] = useState({
        email: '',
        password: ''
      });
      const navigate = useNavigate();
      const [errors, setErrors] = useState({});
      const [emails, setEmail] = useState('');
      const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(values));
        if (errors.email === '' && errors.password === '') {
          Axios.post('http://localhost:8080/login', values)
            .then((res) => {
              if (res.data.success) {
                console.log("email: " + res.data.success);
                console.log("herere: " + res.data.userId);
                const emailid = res.data.email;
                setEmail(res.data.email);
                console.log('Value of email: ',emails);
                const role = res.data.admin;
                // After user authentication
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('email', res.data.email);

                if (role === 1){
                    navigate('/admin',{state: {email: emailid, userId : res.data.userId, userName : res.data.userName }});  
                }
                else if (role === 0){
                    console.log("Login page: " + res.data.userId);
                    navigate('/user',{state: {email: emailid, userId : res.data.userId, userName : res.data.userName}});
                    setErrors("User logged");
                }else {
                    setErrors("Invalid credentials");
                }
                /*
                setTimeout( () => {
                  navigate('/admin',{state: {email: emailid}});
                },2000)
                */
                
              } else {
                alert('Invalid credentials');
              }
            })
            .catch((err) => console.log(err));
        }
      };
      const handleInput = (event) =>{
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}));
        
}
return (
    <>
  <div className="background-image">
  <div className="content">
    <div className="dv1">
      <div className="dv2 technology-block">
        <h1 className="h1">Login</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="d-flex justify-content-center align-items-left mb-2"><strong>Email</strong></label>
            <input type="email" name="email" placeholder="Enter email" onChange={handleInput} className="f1" />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label className="d-flex justify-content-center align-items-left mb-2"><strong>Password</strong></label>
            <input type="password" name="password" placeholder="Enter password" onChange={handleInput} className="f1" />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button type="submit" className="btn1"><strong>Login</strong></button>
          <p className="d-flex justify-content-center align-items-center">If you are a new user, click below</p>
          <Link to="/signup" className="btn1">Register</Link>
        </form>
      </div>
    </div>
  </div>
</div>

    </>
)
}
export default TeacherLogin;
