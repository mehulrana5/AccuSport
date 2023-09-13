import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Context';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const [cred, setCred] = useState({
    email:"",
    password:""
  });

  const context=useContext(AppContext)
  const navigate=useNavigate();

  const handleCredChange = (event) => {
    setCred({...cred,[event.target.id]: event.target.value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    context.register(cred);
  };
  useEffect(()=>{
    // console.log(cred);
  },[cred])
  return (
    <div className="container-1">
      <h2 className="form-heading">Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            email
          </label>
          <input
            type='email'
            id="email"
            // value={cred.email}
            onChange={handleCredChange}
            className="form-input"
            required
          />
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={cred.password}
            onChange={handleCredChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Sign Up
        </button>
        <button onClick={()=>navigate("../login")} className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
