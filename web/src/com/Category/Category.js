import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Layout, Space, Typography, Form, message, Button, Modal, Table, Image,Input  } from "antd";
import axios from 'axios';
import { StockOutlined } from '@ant-design/icons';
import LayoutNew from '../../Layout';
import ItemForm from './AddCat'; // Make sure the import path is correct
 
const { Title } = Typography;
 
const CategoryPage = () => {
  const [form] = Form.useForm();
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const handleCancel = () => {
    setIsAddItemModalVisible(false);
  };
 
  const downloadPDF = () => {
    const doc = new jsPDF();
 
    doc.text("Category List", 14, 15);
 
    const tableData = filteredItems.map(item => [
      item.categoryName,
      item.subcategories,
      item.categoryId,
      // item.imageURL
    ]);
 
    doc.autoTable({
      head: [['Category Name', 'Subcategories', 'Category ID']],
      body: tableData,
      startY: 20,
    });
 
    doc.save("categories.pdf");
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
 
  const filteredItems = items.filter((item) =>
    item.categoryName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.subcategories?.toLowerCase().includes(searchText.toLowerCase())
  );
 
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
            border: "1px solid rgba(30, 96, 157, 0.13)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
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
 
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Input.Search
              placeholder="Search category or subcategory"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              onClick={downloadPDF}
              style={{ backgroundColor: "#1890ff", color: "white" }}
            >
              Download PDF
            </Button>
            <Button
              type="primary"
              onClick={() => setIsAddItemModalVisible(true)}
              style={{ backgroundColor: "#ffc221", color: "black" }}
            >
              Add Category
            </Button>
          </div>
        </Space>
 
 
          <Table
            dataSource={filteredItems}
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