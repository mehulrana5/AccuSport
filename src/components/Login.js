import React, { useContext, useState } from 'react';
import AppContext from '../Context';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await context.login(username, password);
      // Handle successful login
      navigate('/');
    } catch (error) {
      // Handle login failure
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container-1">
      <h2 className="form-heading">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
        <button className="submit-button" onClick={()=>navigate("../signup")}>Sign Up</button>
      </form>
    </div>
  );
};

export default Login;
