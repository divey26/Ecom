import React, { useState } from 'react';
import {
  Layout,
  Card,
  Button,
  Checkbox,
  Form,
  Input,
  Cascader,
  Row,
  Col,
  Select,
  message,
} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LayoutNew from '../../Layout';
import imageSrc from "../../Images/logo.png";

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
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const tailFormItemLayout = {
  wrapperCol: { span: 24 },
};

const Sign = () => {
  const [form] = Form.useForm();
  const [captchaValue, setCaptchaValue] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { confirm, ...formData } = values;

    try {
      const response = await axios.post('http://localhost:5000/api/user/register', formData);
      navigate('/');
    } catch (error) {
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
    <div className="about">
      <LayoutNew>
        <Layout
          style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: 800 }}>
<Card
  title={
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

      <span style={{ marginLeft:"340px",fontSize: '24px', fontWeight: '600' }}>Register</span>
    </div>
  }
  bordered={false}
>

              <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="E-mail"
                      style={{ marginBottom: '12px' }}
                      rules={[
                        { type: 'email', message: 'Invalid E-mail!' },
                        { required: true, message: 'Please input your E-mail!' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="password"
                      label="Password"
                      style={{ marginBottom: '12px' }}
                      rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' },
                      ]}
                      hasFeedback
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="confirm"
                      label="Confirm Password"
                      style={{ marginBottom: '12px' }}
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
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="firstname"
                      label="First Name"
                      style={{ marginBottom: '12px' }}
                      rules={[
                        { required: true, message: 'Please input your First Name!' },
                        { pattern: /^[A-Za-z]+$/, message: 'Only letters allowed!' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="lastname"
                      label="Last Name"
                      style={{ marginBottom: '12px' }}
                      rules={[
                        { required: true, message: 'Please input your Last Name!' },
                        { pattern: /^[A-Za-z]+$/, message: 'Only letters allowed!' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="residence"
                      label="Habitual Residence"
                      style={{ marginBottom: '12px' }}
                      rules={[{ type: 'array', required: true, message: 'Select your residence!' }]}
                    >
                      <Cascader options={residences} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="address"
                      label="Address"
                      style={{ marginBottom: '12px' }}
                      rules={[
                        { required: true, message: 'Please input your Address!' },
                        { min: 5, message: 'At least 5 characters' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      style={{ marginBottom: '12px' }}
                      rules={[
                        { required: true, message: 'Please input your phone number!' },
                        { pattern: /^[0-9]{10}$/, message: 'Exactly 10 digits required!' },
                      ]}
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
                  </Col>
                </Row>

                <Form.Item
                  label="Captcha"
                  style={{ marginBottom: '12px' }}
                  extra="We must make sure that you are a human."
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="captcha"
                        noStyle
                        rules={[{ required: true, message: 'Please input the captcha!' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Button onClick={handleCaptchaClick}>Get captcha</Button>
                      <div style={{ marginTop: 8, fontWeight: 'bold' }}>{captchaValue}</div>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  style={{ marginBottom: '12px' }}
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
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Layout>
      </LayoutNew>
    </div>
  );
};

export default Sign;
