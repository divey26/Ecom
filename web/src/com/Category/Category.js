import React, { useState, useEffect } from 'react';
import { Layout, Space, Typography, Form, message, Button, Modal, Table, Image } from "antd";
import axios from 'axios'; 
import { StockOutlined } from '@ant-design/icons';
import LayoutNew from '../../Layout';
import ItemForm from './AddCat'; // Make sure the import path is correct

const { Title } = Typography;

const CategoryPage = () => {
  const [form] = Form.useForm();
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [items, setItems] = useState([]);

  const handleCancel = () => {
    setIsAddItemModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      console.log('Entered details:', values);
      const response = await axios.post('http://localhost:5000/api/cat', values);
      console.log('Form data saved:', response.data);
      fetchItems();
      setIsAddItemModalVisible(false);
      message.success('Category added successfully!');
    } catch (error) {
      console.error('Error saving form data:', error.response ? error.response.data : error.message);
      message.error(`Registration failed: ${error.response?.data?.error || 'Please try again.'}`);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cat');
      setItems(response.data); // Directly set formatted data from the API
    } catch (error) {
      console.error('Error fetching categories:', error.response ? error.response.data : error.message);
      message.error('Failed to fetch categories. Please try again.');
    }
  };
  
  useEffect(() => {
    fetchItems();
  }, []);

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Subcategories',
      dataIndex: 'subcategories',
      key: 'subcategories',
    },
    {
      title: 'Category ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: 'Image',
      dataIndex: 'imageURL',
      key: 'imageURL',
      render: (imageURL) => <Image width={100} src={imageURL} />,
    },
  ];

  const tableHeaderStyle = {
    backgroundColor: '#f0f0f0',
  };

  return (
    <div className="about">
      <LayoutNew>
        <Layout>
          <Space
            style={{
              background: "rgb(224, 245, 249)",
              color: "black",
              padding: "12px",
              borderRadius: "8px",
              border:"1px solid rgba(30, 96, 157, 0.13)",
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Space>
              <StockOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              <Title
                level={2}
                style={{ fontSize: "24px", marginTop: "8px", color: "#004f9a" }}
              >
                Category
              </Title>
            </Space>
            <Button type="primary" onClick={() => setIsAddItemModalVisible(true)} style={{backgroundColor:"#ffc221",color:"black"}}>
              Add Category
            </Button>
          </Space>

          <Table
            dataSource={items}
            columns={columns}
            rowKey={(record) => record._id || record.categoryId || record.categoryName}
            style={{ marginTop: '20px' }}
            onHeaderRow={() => {
              return {
                style: tableHeaderStyle,
              };
            }}
          />

          <Modal
            open={isAddItemModalVisible}
            title="Add Category"
            cancelText="Cancel"
            onCancel={handleCancel}
            okText="Submit"
            onOk={() => {
              form
                .validateFields()
                .then((values) => onFinish(values))
                .catch((errorInfo) => {
                  console.log('Validation Failed:', errorInfo);
                });
            }}
          >
            <ItemForm form={form} onFinish={onFinish} />
          </Modal>

        </Layout>
      </LayoutNew>
    </div>
  );
};

export default CategoryPage;
