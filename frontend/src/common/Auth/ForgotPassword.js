import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LayoutNew from '../../Layout';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/user/forgot-password', values);
      message.success('Password reset link has been sent to your email');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <LayoutNew>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            color: '#1890ff'
          }}>Forgot Password</h2>
          
          <Form
            form={form}
            name="forgot_password"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Enter your email address" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ width: '100%', height: '40px' }}
              >
                Send Reset Link
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a href="/login">Back to Login</a>
            </div>
          </Form>
        </div>
      </LayoutNew>
    </div>
  );
};

export default ForgotPassword; 