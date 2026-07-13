import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ url, setToken }) => {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(url + "/api/user/admin-login", data);
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className='login'>
      <form onSubmit={onSubmitHandler} className="login-container">
        <div className="login-title">
          <h2>Admin Login</h2>
        </div>
        <div className="login-inputs">
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Admin email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
