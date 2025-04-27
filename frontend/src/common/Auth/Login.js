import React, { useContext } from 'react';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext'; // Import AuthContext
import imageSrc from "../../Images/logo.png";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setAuthenticated, setUserDetails } = useContext(AuthContext); // Access context functions

  const onFinish = async (values) => {
    try {
      // Make API call to log the user in
      const response = await axios.post('http://localhost:5000/api/user/login', values);
      console.log("Login Response:", response.data);

      const { token, userId, email, address, phone } = response.data;

      // Update the context with the authentication details
      setAuthenticated(true);  // Set the user as authenticated
      setUserDetails({ userId, email, address, phone }); // Set the user details in context

      // Store token and user details in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userAddress', address);
      localStorage.setItem('userPhone', phone);

      // Clear the cart if there's any existing cart data
      localStorage.removeItem('cart');

      // Redirect to the home page after successful login
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={styles.container}>
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        style={styles.form}
        scrollToFirstError
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <img src={imageSrc} alt="Logo" style={{ width: "45%" }} />
        </div>

        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#F3C623",
            textAlign: "center",
            paddingBottom: "20px",
          }}
        >
          HALO
        </div>

        <div style={{ marginBottom: "8px", fontSize: "18px", color: "wheat", paddingTop: "15px", borderTop: "2px solid wheat" }}>Enter the Email</div>
        <Form.Item
          name="email"
          labelCol={{ span: 24 }}
          rules={[
            { type: 'email', message: 'The input is not valid E-mail!' },
            { required: true, message: 'Please input your E-mail!' },
          ]}
        >
          <Input />
        </Form.Item>

        <div style={{ marginBottom: "8px", fontSize: "18px", color: "wheat" }}>Enter the Password</div>
        <Form.Item
          name="password"
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <br />
        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: "#F3C623", color: "blue", fontSize: "20px" }}>Login</Button>
        </Form.Item>

        <div style={{ textAlign: "center", marginTop: "10px", fontSize: "16px", color: "white" }}>
          Don't have an account? <a href="/sign" style={{ color: "#F3C623", fontWeight: "bold" }}>Sign up</a>
        </div>
      </Form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgb(76, 149, 163)',
  },
  form: {
    maxWidth: '500px',
    width: '100%',
    padding: '60px',
    backgroundColor: '#004f9a',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
};

export default Login;
