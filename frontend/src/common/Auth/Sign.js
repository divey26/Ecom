import React, { useState } from 'react';
import { Layout } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LayoutNew from '../../Layout';
import { Button, Checkbox, Form, Input, Cascader, Row, Col, Select, message } from 'antd';

const { Option } = Select;

const residences = [
  {
    value: 'central',
    label: 'Central',
    children: [
      { value: 'kandy', label: 'Kandy' },
      { value: 'matale', label: 'Matale' },
      { value: 'nuwaraEliya', label: 'Nuwara Eliya' },
    ],
  },
  {
    value: 'western',
    label: 'Western',
    children: [
      { value: 'colombo', label: 'Colombo' },
      { value: 'gampaha', label: 'Gampaha' },
      { value: 'kalutara', label: 'Kalutara' },
    ],
  },
];

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 24 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 24 } },
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 24, offset: 0 } },
};

const Sign = () => {
  const [form] = Form.useForm();
  const [captchaValue, setCaptchaValue] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { confirm, ...formData } = values;

    try {
      console.log('Entered details:', formData);
      const response = await axios.post('http://localhost:5000/api/user/register', formData);
      console.log('Form data saved:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error saving form data:', error.response ? error.response.data : error.message);
      message.error('Registration failed. Please try again.');
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="94">+94</Option>
      </Select>
    </Form.Item>
  );

  const handleCaptchaClick = () => {
    setCaptchaValue(Math.random().toString(36).substring(2, 6));
  };

  return (
    <div className="about" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <LayoutNew>
        <Layout>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '30px',
              color: '#1890ff'
            }}>Create Account</h2>
            <Form 
              {...formItemLayout} 
              form={form} 
              name="register" 
              onFinish={onFinish} 
              style={{ maxWidth: 600 }} 
              scrollToFirstError
            >
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  { type: 'email', message: 'The input is not a valid E-mail!' },
                  { required: true, message: 'Please input your E-mail!' },
                ]}
                labelAlign="left"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' },
                ]}
                hasFeedback
                labelAlign="left"
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
                labelAlign="left"
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="firstname"
                label="First Name"
                rules={[
                  { required: true, message: 'Please input your First Name!', whitespace: true },
                  { pattern: /^[A-Za-z]+$/, message: 'First Name should only contain letters!' },
                ]}
                labelAlign="left"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastname"
                label="Last Name"
                rules={[
                  { required: true, message: 'Please input your Last Name!', whitespace: true },
                  { pattern: /^[A-Za-z]+$/, message: 'Last Name should only contain letters!' },
                ]}
                labelAlign="left"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="residence"
                label="Habitual Residence"
                rules={[{ type: 'array', required: true, message: 'Please select your habitual residence!' }]}
                labelAlign="left"
              >
                <Cascader options={residences} />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: 'Please input your Address!' },
                  { min: 5, message: 'Address should be at least 5 characters long!' },
                ]}
                labelAlign="left"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please input your phone number!' },
                  { pattern: /^[0-9]{10}$/, message: 'Phone number must be exactly 10 digits!' }
                ]}
                labelAlign="left"
              >
                <Input 
                  addonBefore={prefixSelector} 
                  style={{ width: '100%' }} 
                  maxLength={10}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item 
                label="Captcha" 
                extra="We must make sure that you are a human."
                labelAlign="left"
              >
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name="captcha"
                      noStyle
                      rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button onClick={handleCaptchaClick}>Get captcha</Button>
                    <div>{captchaValue}</div>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('You must accept the agreement')),
                  },
                ]}
                {...tailFormItemLayout}
              >
                <Checkbox>
                  I have read the <a href="">agreement</a>
                </Checkbox>
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{ 
                    width: '100%',
                    height: '40px',
                    fontSize: '16px'
                  }}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Layout>
      </LayoutNew>
    </div>
  );
};

export default Sign;
