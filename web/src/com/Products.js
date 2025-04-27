import React, { useState, useEffect } from 'react';
import { Layout, Select, Space, Typography, Modal, Button, Form, Row, Col, Input, Upload, message, Radio } from 'antd';
import axios from 'axios';
import { StockOutlined, UploadOutlined } from '@ant-design/icons';
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
  const [discountType, setDiscountType] = useState('fixed'); // New state for discount type
  const [isDiscountHidden, setIsDiscountHidden] = useState(false); // State to track if discount input should be hidden
  const [discountValue, setDiscountValue] = useState(0); // State to track the discount value

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
      setDiscountType(product.discountType || 'percentage'); // Set discount type from the product data
      setDiscountValue(product.discount || 0); // Set discount value
      setIsDiscountHidden(product.discountType === 'hide'); // Set visibility of discount input
    }
  };

  // Hide modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCategory('');
    setSelectedSubcategory('');
    setFile(null);
    setProductToEdit(null); // Reset product to edit
    setDiscountType('percentage'); // Reset discount type
    setIsDiscountHidden(false); // Reset discount hidden state
    setDiscountValue(0); // Reset discount value
  };

  // Handle save or update product
  const handleSave = async (values) => {
    const discountPercentageToSave = isDiscountHidden ? calculateDynamicDiscount(values) : discountValue; // Use dynamic discount percentage if hidden
  
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
        discount: discountPercentageToSave, // Store discount percentage here
        discountType, // Save discount type (percentage or fixed)
        description: values.description,
        imageURL: imageURL || productToEdit?.imageURL, // Use existing image URL if no new image is uploaded
        initialStocks: values.initialStocks, // Add initialStocks here
        currentStocks: values.currentStocks, // Add currentStocks here
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
  

// Calculate dynamic discount percentage based on stock levels
const calculateDynamicDiscount = (values) => {
  const { initialStocks, currentStocks } = values;
  const stockPercentage = (currentStocks / initialStocks) * 100;

  if (stockPercentage > 75) return 0; // No discount
  if (stockPercentage > 50) return 5; // 5% discount
  if (stockPercentage > 25) return 8; // 8% discount
  if (stockPercentage > 15) return 10; // 10% discount
  return 12; // 12% discount
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
              border: "1px solid rgba(30, 96, 157, 0.13)",
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
            <Button type="primary" onClick={() => showModal()} style={{ backgroundColor: "#ffc221", color: "black", fontSize: "16px" }}>
              Add products
            </Button>
          </Space>

          <br />

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
                    >
                      {subcategories.map((sub, index) => (
                        <Option key={index} value={sub}>
                          {sub}
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
                    rules={[{ required: true, message: 'Please input the price!' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="rating"
                    label="Rating"
                    rules={[{ required: true, message: 'Please input the rating!' }]}
                  >
                    <Input type="number" min={0} max={5} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="offerName" label="Offer Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="discountType" label="Discount Type">
                    <Radio.Group value={discountType} onChange={(e) => {
                      setDiscountType(e.target.value);
                      setIsDiscountHidden(e.target.value === 'hide'); // Hide discount input if dynamic
                    }}>
                      <Radio value="fixed">Fixed</Radio>
                      {/*<Radio value="hide">Dynamic</Radio>*/}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              {(discountType === 'percentage' || discountType === 'fixed') && !isDiscountHidden && (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      name="discount"
                      label="Discount"
                      rules={[{ required: discountType !== 'hide', message: 'Please input a discount value!' }]}
                    >
                      <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder="Enter discount value"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item name="description" label="Description">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item name="image" label="Product Image">
                    <Upload beforeUpload={() => false} fileList={file ? [file] : []} onChange={handleFileChange}>
                      <Button icon={<UploadOutlined />} />
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="initialStocks"
                    label="Initial Stocks"
                    rules={[{ required: true, message: 'Please input the initial stock count!' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="currentStocks"
                    label="Current Stocks"
                    rules={[{ required: true, message: 'Please input the current stock count!' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Button type="primary" htmlType="submit" block>
                Save Product
              </Button>
            </Form>
          </Modal>
        </div>
        <ProductList onEditProduct={showModal} />

      </Layout>
    </LayoutNew>
  );
};

export default CategoryModal;
