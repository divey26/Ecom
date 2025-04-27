import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import imageSrc from "../Images/logo.png";

const { Title, Text } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/sellers/login', values);
      const { sellerId, sellerObjectId, token } = response.data;

      // Store sellerId and ObjectId in local storage
      localStorage.setItem('sellerId', sellerId);
      localStorage.setItem('sellerObjectId', sellerObjectId);
      localStorage.setItem('token', token);

      if (sellerId.startsWith("SE")) {
        localStorage.setItem('usertype', 'seller');
      }
      else{
        localStorage.setItem('usertype', 'admin');

      }
      
      console.log("Seller ID:", localStorage.getItem('sellerId'));
      console.log("User Type:", localStorage.getItem('usertype'));
      console.log("Seller Object ID:", localStorage.getItem('sellerObjectId'));

      setMessage(response.data.message);
      setError('');
      navigate('/dash');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src={imageSrc} alt="Logo" style={{ width: "45%" }} />
        </div>

        <Title level={3} style={{ color: "#F3C623", textAlign: "center" }}>HALO</Title>
        <Title level={4} style={{ textAlign: 'center', color: 'wheat' }}>Seller Login</Title>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />}
        {message && <Alert message={message} type="success" showIcon style={{ marginBottom: 10 }} />}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={<Text style={{ color: 'wheat' }}>Enter the Email</Text>}
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            label={<Text style={{ color: 'wheat' }}>Enter the Password</Text>}
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              placeholder="Password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading} style={{ width: '100%', backgroundColor: "#F3C623", color: "blue", fontSize: "20px" }}>
              {loading ? <Spin /> : 'Login'}
            </Button>
          </Form.Item>
        </Form>

        {/* Don't have an account? Sign Up */}
        <div style={{ textAlign: 'center', marginTop: 15 }}>
          <Text style={{ color: 'wheat' }}>Don't have an account? </Text>
          <Link to="/sellers" style={{ color: "#F3C623", fontWeight: "bold" }}>Sign Up</Link>
        </div>
      </div>
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
    maxWidth: '400px',
    width: '100%',
    padding: '40px',
    backgroundColor: '#004f9a',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
};

export default LoginForm;
