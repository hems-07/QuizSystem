import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import validation from './SignupValidation'
import Axios from 'axios'
import './signup.css';


function Signup() {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        admin: ''
      });
      const navigate = useNavigate();
      const [errors, setErrors] = useState({});

      console.log(values);
      const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(values));
        if(errors.name==="" && errors.email==="" && errors.password===""){
            console.log("Getting in 1");
            Axios.post('http://localhost:8080/signup', values)
            .then(res => {
                console.log("Getting in 2");
                console.log(res.data);
                if(res.data.success){
                    setTimeout( () => {
                        navigate('/login');
                    },2000)
                }else{
                    alert(res.data.message);
                }
            })
           .catch((err) => console.log(err));
        }
      };
      const handleInput = (event) =>{
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}));
        
    }
    const handleRadioChange = (event) => {
        // Check if the "Teacher" option is selected
        if (event.target.id === 'option-2') {
          setValues({ ...values, admin: 1 }); // Set admin to 1 for teacher
        } else {
          setValues({ ...values, admin: 0 }); // Set admin to 0 for student
        }
    };
return (
    <>
<div class="background-image01">
  <div class="content01">
    <div className='dv01'>
        <div className='dv02'>
            <h1>Sign-up</h1>
            <form action="" onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='d-flex justify-content-left align-items-left mb-2'><strong>User name</strong></label>
                    <input type="text" placeholder='Enter name' name='username' onChange={handleInput} className='f01'/>
                    {errors.name && <span className='text-danger'>{errors.name}</span>}
                    
                </div>
                <div className='mb-3'>
                    <label className='d-flex justify-content-left align-items-left mb-2'><strong>Email</strong></label>
                    <input type="email" placeholder='Enter email' onChange={handleInput} name='email' className='f01'/>
                    {errors.email && <span className='text-danger'>{errors.email}</span>}
                </div>
                
                <div className='mb-3'>
                    <label className='d-flex justify-content-left align-items-left mb-2'><strong>Password</strong></label>
                    <input type="password" placeholder='Enter password' name='password' onChange={handleInput} className='f01'/>
                    {errors.password && <span className='text-danger'>{errors.password}</span>}
                </div>
                <button type='submit' className='btn01'><strong>Signup</strong></button>
                <p className='mt-3'>By signing up, You agree to our terms and conditions</p>
                <Link to='/login' className='btn01'><strong>Login</strong></Link>
            </form>
            <div className="wrapper">
                <input
                    type="radio"
                    name="select"
                    id="option-1"
                    checked={values.admin === 0}
                    onChange={handleRadioChange}
                />
                <input
                    type="radio"
                    name="select"
                    id="option-2"
                    checked={values.admin === 1}
                    onChange={handleRadioChange}
                />
                <label htmlFor="option-1" className="option option-1">
                    <div className="dot"></div>
                    <span>Student</span>
                </label>
                <label htmlFor="option-2" className="option option-2">
                    <div className="dot"></div>
                    <span>Teacher</span>
                </label>
                </div>
        </div>
    </div>
    </div>
    </div>
    </>
  )
}

export default Signup;
