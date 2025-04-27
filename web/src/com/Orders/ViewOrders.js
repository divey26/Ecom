import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Collapse, Row, Col, Card, Tag, Button } from 'antd';
import { ShoppingCartOutlined, DollarCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the plugin
import Layout from '../../Layout'

const { Panel } = Collapse;


const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/order/view');
        const ordersWithDetails = await Promise.all(response.data.orders.map(async (order) => {
          const updatedCartItems = await Promise.all(order.cartItems.map(async (item) => {
            try {
              const response = await axios.get(`http://localhost:5000/api/products/objectId/${item.productId._id}`);
              return {
                ...item,
                productDetails: response.data.product, // Store product details in each item
              };
            } catch (err) {
              console.error('Error fetching product details:', err);
              return item; // Return item without updates in case of error
            }
          }));
          return {
            ...order,
            cartItems: updatedCartItems, // Replace cartItems with updated items containing product details
          };
        }));
        setOrders(ordersWithDetails);
      } catch (err) {
        setError('Error fetching orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'User Details',
      key: 'userDetails',
      render: (order) => (
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Panel header="User Details" key="1" style={{ background: 'linear-gradient(to right, #4facfe, #00f2fe)', borderRadius: '10px' }}>
            <Row>
              <Col span={8}>
                <strong>Name: </strong>
                {order.userId ? `${order.userId.firstname} ${order.userId.lastname}` : 'N/A'}
              </Col>
              <Col span={8}>
                <strong>Email: </strong>
                {order.userId ? order.userId.email : 'N/A'}
              </Col>
              <Col span={8}>
                <strong>Phone: </strong>
                {order.userId ? order.userId.phone : 'N/A'}
              </Col>
            </Row>
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Order Details',
      key: 'orderDetails',
      render: (order) => (
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Panel header="Order Details" key="2" style={{ background: '#e8e8e8', borderRadius: '10px' }}>
            <Row>
              <Col span={8}>
                <strong>Total Amount: </strong> <DollarCircleOutlined style={{ color: '#ffcc00' }} /> ${order.totalAmount}
              </Col>
              <Col span={8}>
                <strong>Payment Status: </strong>
                <Progress
                  type="circle"
                  width={40}
                  format={() => order.paymentStatus === 'succeeded' ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
                />
              </Col>
              <Col span={8}>
                <strong>Order Date: </strong> {new Date(order.orderDate).toLocaleString()}
              </Col>
            </Row>
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Shipping Address',
      key: 'shippingAddress',
      render: (order) => (
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Panel header="Shipping Address" key="3" style={{ background: 'linear-gradient(to right, #ff758c, #ff7eb3)', borderRadius: '10px' }}>
            {order.shippingAddress
              ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
              : 'N/A'}
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Products',
      key: 'products',
      render: (order) => (
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Panel header={<span><ShoppingCartOutlined /> View Products</span>} key="4" style={{ background: 'linear-gradient(to right, #9d50bb, #6e48aa)', borderRadius: '10px' }}>
            {order.cartItems.map((item, index) => (
              <Card key={item._id || index} style={{ marginBottom: '15px', background: '#fff' }} >
                <Row>
                  <Col span={24}>
                    <strong>Product:</strong>
                    <br></br>
                    {item.productDetails ? item.productDetails.itemName : 'Loading...'}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <strong>Quantity:</strong> {item.quantity}
                  </Col>
                  <Col span={12}>
                    <strong>Price:</strong> ${item.price}
                  </Col>
                </Row>
              </Card>
            ))}
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (order) => (
        <Button type="primary" onClick={() => handleDownloadPdf(order)}>
          Download as PDF
        </Button>
      ),
    }
    
  ];
  const handleDownloadPdf = (order) => {
    const doc = new jsPDF();
    let y = 20; // Initial vertical position
    
    doc.setFontSize(16);
    doc.text(`Order ID: ${order._id}`, 20, y);
    y += 10;
  
    // Order details
    doc.setFontSize(12);
    doc.text(`Total Amount: $${order.totalAmount}`, 20, y);
    doc.text(`Payment Status: ${order.paymentStatus}`, 20, y + 5);
    doc.text(`Order Date: ${new Date(order.orderDate).toLocaleString()}`, 20, y + 10);
    doc.text(
      `Shipping Address: ${
        order.shippingAddress
          ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
          : 'N/A'
      }`,
      20,
      y + 15
    );
    y += 30;
    
    // User details
    doc.setFontSize(14);
    doc.text('User Details:', 20, y);
    y += 5;
    doc.setFontSize(12);
    doc.text(`Name: ${order.userId ? `${order.userId.firstname} ${order.userId.lastname}` : 'N/A'}`, 20, y);
    doc.text(`Email: ${order.userId ? order.userId.email : 'N/A'}`, 20, y + 5);
    doc.text(`Phone: ${order.userId ? order.userId.phone : 'N/A'}`, 20, y + 10);
    y += 20;
    
    // Products Table
    const products = order.cartItems.map((item) => ({
      productName: item.productDetails ? item.productDetails.itemName : 'Unknown Product',
      price: `$${item.price}`,
      quantity: item.quantity,
      total: `$${item.total}`,
    }));
  
    doc.autoTable({
      startY: y,
      head: [['Product', 'Price', 'Quantity', 'Total']],
      body: products.map((product) => [
        product.productName,
        product.price,
        product.quantity,
        product.total,
      ]),
      margin: { top: 10, left: 20, right: 20 },
      styles: {
        fontSize: 12,
        cellPadding: 4,
      },
    });
  
    doc.save(`order_${order._id}.pdf`);
  };
  
  

  return (
    <Layout>
    <div>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message="Error" description={error} type="error" />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
    </Layout>
  );
};

export default OrderList;
