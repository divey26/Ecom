import React, { useState, useEffect } from 'react';
import { Layout, Select, Space, Typography, Modal, Button, Form, Row, Col, Input, Upload, message } from 'antd';
import axios from 'axios';
import { StockOutlined } from '@ant-design/icons';
import { storage } from '../Firebase/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import 'antd/dist/reset.css';
import LayoutNew from '../Layout';
import ProductList from './Products/ProductList'; // Path to the ProductsList component

const { Title } = Typography;
const { Option } = Select;

const CategoryModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null); // State to track product being edited

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cat'); // Adjust API endpoint
        const formattedCategories = response.data.map(category => ({
          value: category.categoryId,
          label: category.categoryName,
          subcategories: category.subcategories.split(', '),
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const category = categories.find(cat => cat.value === value);
    setSubcategories(category ? category.subcategories : []);
    setSelectedSubcategory(''); // Reset subcategory
  };

  // Handle subcategory change
  const handleSubcategoryChange = (value) => {
    setSelectedSubcategory(value);
  };

  // Handle file selection
  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setFile(fileList[0].originFileObj);
    } else {
      setFile(null);
    }
  };

  // Upload image to Firebase
  const handleUpload = async (file) => {
    if (!file) {
      message.error('No file selected for upload.');
      return null;
    }

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `items/${file.name}`);
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
              message.success('Upload successful!');
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
      message.error(`Error: ${error.message}`);
      setIsUploading(false);
      return null;
    }
  };

  // Show modal with pre-filled data for editing
  const showModal = (product = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
    if (product) {
      setSelectedCategory(product.category);
      setSelectedSubcategory(product.subcategory);
      setFile(null); // Optional, reset file
    }
  };

  // Hide modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCategory('');
    setSelectedSubcategory('');
    setFile(null);
    setProductToEdit(null); // Reset product to edit
  };

  // Handle save or update product
  const handleSave = async (values) => {
    const imageURL = await handleUpload(file);
    if (imageURL) {
      const productData = {
        productId: productToEdit ? productToEdit.productId : `PRO${Math.floor(1000 + Math.random() * 9000)}`,
        itemName: values.itemName,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        price: values.price,
        rating: values.rating,
        offerName: values.offerName,
        discount: values.discount,
        description: values.description,
        imageURL: imageURL || productToEdit?.imageURL, // Use existing image URL if no new image is uploaded
      };

      try {
        const apiUrl = productToEdit ? `http://localhost:5000/api/products/${productToEdit.productId}` : 'http://localhost:5000/api/products';
        const method = productToEdit ? 'put' : 'post';

        const response = await axios({ method, url: apiUrl, data: productData });
        console.log('Product saved successfully:', response.data);
        setIsModalOpen(false);
      } catch (error) {
        message.error('Failed to save product. Please try again.');
      }
    } else {
      message.error('Image upload failed. Please try again.');
    }
  };

  return (
    <LayoutNew>
      <Layout>
        <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
          <Space
            style={{
              background: "rgb(224, 245, 249)",
              color: "black",
              padding: "12px",
              border:"1px solid rgba(30, 96, 157, 0.13)",
              borderRadius: "8px",
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Space>
              <StockOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              <Title level={2} style={{ fontSize: "24px", marginTop: "8px", color: "#004f9a" }}>
                Products
              </Title>
            </Space>
            {/* Button to Open Modal */}
            <Button type="primary" onClick={() => showModal()} style={{backgroundColor:"#ffc221",color:"black",fontSize:"16px"}}>
              Add products
            </Button>
          </Space>

          <br />

          {/* Modal */}
          <Modal
            title={productToEdit ? "Edit Product" : "Add New Product"}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form layout="vertical" onFinish={handleSave} initialValues={productToEdit}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    name="itemName"
                    label="Item Name"
                    rules={[{ required: true, message: 'Please input the item name!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                  >
                    <Select value={selectedCategory} onChange={handleCategoryChange} placeholder="Select Category">
                      {categories.map(category => (
                        <Option key={category.value} value={category.value}>
                          {category.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="subcategory"
                    label="Subcategory"
                    rules={[{ required: true, message: 'Please select a subcategory!' }]}
                  >
                    <Select
                      value={selectedSubcategory}
                      onChange={handleSubcategoryChange}
                      placeholder="Select Subcategory"
                      disabled={!subcategories.length}
                    >
                      {subcategories.map(subcategory => (
                        <Option key={subcategory} value={subcategory}>
                          {subcategory}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Please input the item price!' }]}
                >
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value).toFixed(2);
                      e.target.value = value; // Format input to `.00` on blur
                    }}
                  />
                </Form.Item>

                </Col>
                <Col span={12}>
                  <Form.Item
                    name="rating"
                    label="Rating"
                    rules={[{ required: true, message: 'Please input the rating!' }]}
                  >
                    <Input type="number" step="0.1" max={5} min={1} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="offerName"
                    label="Offer Name"
                    rules={[{ required: true, message: 'Please input the offer name!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="discount"
                    label="Discount"
                    rules={[{ required: true, message: 'Please input the discount!' }]}
                  >
                    <Input type="number" max={100} min={0} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input a description!' }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Upload
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    fileList={file ? [{ originFileObj: file, uid: '1', name: file.name }] : []}
                  >
                    <Button>Select Image</Button>
                  </Upload>
                </Col>
              </Row>

              <Row justify="end">
                <Col>
                  <Button type="primary" htmlType="submit" loading={isUploading}>
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal>
          <ProductList />
        </div>
      </Layout>
    </LayoutNew>
  );
};

export default CategoryModal;
