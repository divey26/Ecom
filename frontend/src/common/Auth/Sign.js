import React,{ useState } from 'react';
import { Layout } from 'antd';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import LayoutNew from '../../Layout';
import {
  AutoComplete,
  Button,
  message,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
} from 'antd';


const { Option } = Select;

const residences = [
  
    {
      value: 'central',
      label: 'Central',
      children: [
        { value: 'kandy', label: 'Kandy' },
        { value: 'matale', label: 'Matale' },
        { value: 'nuwaraEliya', label: 'Nuwara Eliya' }
      ],
    },
    {
      value: 'eastern',
      label: 'Eastern',
      children: [
        { value: 'batticaloa', label: 'Batticaloa' },
        { value: 'ampara', label: 'Ampara' },
        { value: 'trincomalee', label: 'Trincomalee' }
      ],
    },
    {
      value: 'northern',
      label: 'Northern',
      children: [
        { value: 'jaffna', label: 'Jaffna' },
        { value: 'kilinochchi', label: 'Kilinochchi' },
        { value: 'mannar', label: 'Mannar' },
        { value: 'mullaitivu', label: 'Mullaitivu' },
        { value: 'vavuniya', label: 'Vavuniya' }
      ],
    },
    {
      value: 'northCentral',
      label: 'North Central',
      children: [
        { value: 'anuradhapura', label: 'Anuradhapura' },
        { value: 'polonnaruwa', label: 'Polonnaruwa' }
      ],
    },
    {
      value: 'northWestern',
      label: 'North Western',
      children: [
        { value: 'kurunegala', label: 'Kurunegala' },
        { value: 'puttalam', label: 'Puttalam' }
      ],
    },
    {
      value: 'sabaragamuwa',
      label: 'Sabaragamuwa',
      children: [
        { value: 'ratnapura', label: 'Ratnapura' },
        { value: 'kegalle', label: 'Kegalle' }
      ],
    },
    {
      value: 'southern',
      label: 'Southern',
      children: [
        { value: 'galle', label: 'Galle' },
        { value: 'matara', label: 'Matara' },
        { value: 'hambantota', label: 'Hambantota' }
      ],
    },
    {
      value: 'uva',
      label: 'Uva',
      children: [
        { value: 'badulla', label: 'Badulla' },
        { value: 'moneragala', label: 'Moneragala' }
      ],
    },
    {
      value: 'western',
      label: 'Western',
      children: [
        { value: 'colombo', label: 'Colombo' },
        { value: 'gampaha', label: 'Gampaha' },
        { value: 'kalutara', label: 'Kalutara' }
      ],
    }
  
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

const Sign = () => {
  const [form] = Form.useForm();
  const [captchaValue, setCaptchaValue] = useState('');
  const navigate = useNavigate();


  const onFinish = async (values) => {
    const { confirm, ...formData } = values;  

    try {
      // Log the entered details
      console.log('Entered details:', formData);
    
      const response = await axios.post('http://localhost:5000/api/user/register', formData);
      console.log('Form data saved:', response.data);
    
      window.location.href = '/';
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
    // Simulate getting a captcha value
    setCaptchaValue(Math.random().toString(36).substring(2, 6));
  };

  return (
    <div className="about">
      <LayoutNew>
        <Layout>
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
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your E-mail!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
              hasFeedback
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
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="firstname"
              label="First Name"
              rules={[{ required: true, message: 'Please input your First Name!', whitespace: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[{ required: true, message: 'Please input your Last Name!', whitespace: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="residence"
              label="Habitual Residence"
              rules={[{ type: 'array', required: true, message: 'Please select your habitual residence!' }]}
            >
              <Cascader options={residences} />
            </Form.Item>


            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please input your First Name!', whitespace: true }]}
            >
              
              <Input />
            </Form.Item>

            
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Captcha" extra="We must make sure that your are a human.">
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
                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
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
        </Layout>
      </LayoutNew>
    </div>
    
  );
};



export default Sign;
