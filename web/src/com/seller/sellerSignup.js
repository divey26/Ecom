import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Alert, Spin, Typography, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const SellerSignup = () => {
  const [formData, setFormData] = useState({
    sellerId: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    shopName: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sellers/getSellerId');
        const data = await response.json();
        if (response.ok) {
          setFormData((prevData) => ({ ...prevData, sellerId: data.sellerId }));
          form.setFieldsValue({ sellerId: data.sellerId });
        } else {
          setError(data.message);
          message.error(data.message);
        }
      } catch (error) {
        setError('Error fetching seller ID');
        message.error('Error fetching seller ID');
      }
    };

    fetchSellerId();
  }, [form]);

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/sellers/signup', values);
      setMessage(response.data.message);
      message.success('Seller registered successfully!');
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
        <Title level={3} style={{ color: "#F3C623", textAlign: "center" }}>HALO</Title>
        <Title level={4} style={{ textAlign: 'center', color: 'wheat' }}>Seller Signup</Title>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />}
        {message && <Alert message={message} type="success" showIcon style={{ marginBottom: 10 }} />}

        <Form form={form} name="sellerSignup" onFinish={handleSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<Text style={{ color: 'wheat' }}>Seller ID</Text>} name="sellerId">
                <Input style={{color:"White",backgroundColor:"grey"}} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<Text style={{ color: 'wheat' }}>Name</Text>} name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<Text style={{ color: 'wheat' }}>Email</Text>} name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please input a valid email!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<Text style={{ color: 'wheat' }}>Phone</Text>} name="phone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<Text style={{ color: 'wheat' }}>Address</Text>} name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<Text style={{ color: 'wheat' }}>Shop Name</Text>} name="shopName" rules={[{ required: true, message: 'Please input your shop name!' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<Text style={{ color: 'wheat' }}>Password</Text>} name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<Text style={{ color: 'wheat' }}>Confirm Password</Text>} name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
                <Input.Password iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading} style={{ backgroundColor: "#F3C623", color: "blue", fontSize: "20px" }}>
              {loading ? <Spin /> : 'Sign Up'}
            </Button>
          </Form.Item>
        </Form>
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
    maxWidth: '500px',
    width: '100%',
    padding: '40px',
    backgroundColor: '#004f9a',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
};

export default SellerSignup;
