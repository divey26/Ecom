//Add cat
import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Upload, message, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'; // Import the icons
import { storage, auth } from '../../Firebase/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';

const ItemForm = ({ form, onFinish = () => {} }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const generateCategoryId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `CAT${randomNum}`;
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setFile(fileList[0].originFileObj);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async (file) => {
    if (!file) {
      message.error("No file selected for upload.");
      return null;
    }

    try {
      setIsUploading(true);
      const userCredential = await signInWithEmailAndPassword(auth, "divensignature@gmail.com", "12345678");
      const user = userCredential.user;

      const storageRef = ref(storage, `categories/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            message.error(`Upload failed: ${error.message}`);
            setIsUploading(false);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              message.success("Upload successful!");
              setIsUploading(false);
              resolve(downloadURL);
            } catch (error) {
              message.error(`Failed to retrieve download URL: ${error.message}`);
              setIsUploading(false);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      message.error(`Authentication failed: ${error.message}`);
      setIsUploading(false);
      return null;
    }
  };

  const handleSubmit = async (values) => {
    const categoryId = generateCategoryId(); // Generate category ID
    const imageURL = await handleUpload(file);
    if (imageURL) {
      // Fix: Map directly to subcategory names
      const subcategoryObjects = values.subcategories.map(sub => sub); 
      onFinish({ ...values, imageURL, categoryId, subcategories: subcategoryObjects });
    } else {
      message.error('Image upload failed. Please try again.');
    }
  };
  

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Please input the category name!', whitespace: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            name="subcategories"
            label="Subcategories"
            rules={[{ required: true, message: 'Please input at least one subcategory!' }]}
          >
            <Form.List
              name="subcategories"
              initialValue={['']}
              rules={[
                {
                  validator: async(_, subcategories) => {
                    if (!subcategories || subcategories.length < 1) {
                      return Promise.reject(new Error('At least one subcategory is required'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, fieldKey, name, fieldArrayIndex }, index) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...name}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: 'Subcategory name is required' }]}
                      >
                        <Input placeholder={`Subcategory ${index + 1}`} />
                      </Form.Item>
                      <Button type="danger" onClick={() => remove(name)} icon={<MinusCircleOutlined />} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Add Subcategory
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            fileList={file ? [{ originFileObj: file, uid: '1', name: file.name }] : []}
          >
            <Button>Select Image</Button>
          </Upload>
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Button type="primary" htmlType="submit" loading={isUploading}>
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ItemForm;
