import React, { useContext} from 'react';
import AppContext from '../Context';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';


const Login = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await context.login(username, password);
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //   }
  // };

  async function handelLogin(email,password){
    try {
      await context.login(email,password)
      navigate("/")
    } catch (error) {
      console.log(error);   
    }
  }

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    handelLogin(data.email,data.password);
}

  return (
    <div className="container-1">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Email</h3>
        <input
          className='form-input'
          type='email'
          {...register('email', {
            required: true,
          })}
        />
        {errors.email && errors.email.type === "required" && (
          <p style={{ color: "red" }}>Please enter email.</p>
        )}
        <h3>Password</h3> 
        <input
          className='form-input'
          type='password'
          {...register('password', {
            required: true,
          })}
        />
        {errors.password && errors.password.type === "required" && (
          <p style={{ color: "red" }}>Please enter password.</p>
        )}
        <button type="submit" className='blue-btn'>Login</button>
      </form>
    </div>
  );
};

export default Login;
