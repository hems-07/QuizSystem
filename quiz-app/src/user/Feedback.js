import React,{useState, useContext} from 'react'
import './Feedback.css'
import Axios from 'axios'
import { useLocation,useNavigate } from 'react-router-dom'
import { UserContext } from '../teacher/CommonLayout';
import UserHeaderNav from "../Navbar/UserHeaderNav.js";

function Feedback() {
    const navigate = useNavigate();
    const { email, userId, username } = useContext(UserContext);
    console.log("Value of modname is ",username);
    const [values, setvalues] = useState({
        Username: username,
        feedback: ''
      });

      const handleSubmit = (event) => {
        event.preventDefault();
        const feed = values.feedback;
        values.name=username;
        console.log("feed is ",feed);
        console.log("before sending ",values)
        Axios.post('http://localhost:8080/dashboard/feedback', values)
           .then(res => {
               if(res.data === 'Success'){
                   console.log("inside feed is ",feed);
                    setTimeout( () => {
                        navigate('/user',{state: {userName: username, userId: userId, email: email}});
                    },300)
                   
               }
           })
           .catch((err) => console.log(err));
        
      };
      const handleInput = (event) =>{
        setvalues(prev => ({...prev, [event.target.name]: [event.target.value]}));
        
    }
    return (
    <>
    <div>
        <UserHeaderNav username={username} />
        <h1 className="h1" style={{marginTop:'25px'}}>Feedback Portal</h1>
      <div className="container technology-block" style={{marginTop: '10px', marginBottom: '10px'}}>
            <form action="" onSubmit={handleSubmit} className="center-text">
              <div className="mb-3">
                <label className="d-flex justify-content-left align-items-left mb-2"><strong>Username</strong></label>
                <input type="text" name="name" value={username} onChange={handleInput} className="form-control round-input" />
                
              </div>
              <div className="mb-3">
                <label className="d-flex justify-content-left align-items-left mb-2"><strong>Feedback</strong></label>
                <input type="text" name="feedback" placeholder="Enter your feedback" onChange={handleInput} className="form-control round-input" />
                
              </div>
              <div>
            <button type="submit" className="btn-primary center-button grow-on-hover" style={{ marginTop: '30px', marginLeft: '500px !important'}}><strong>Submit Feedback</strong></button>
            </div>
              
            </form>
            
          </div>
    </div>
    </>
    )
}

export default Feedback