import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Typography, Row, Col, Divider } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          navigate('/login'); // Redirect to login page if no token found
          return;
        }

        const response = await axios.get('http://localhost:5000/api/sellers/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        });

        setSeller(response.data.seller);
      } catch (error) {
        setError(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />;
  }

  return (
    <div style={styles.container}>
      {/* Top Metrics Section */}
      <Row gutter={16} style={styles.metricsRow}>
        <Col span={6}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Orders</Text>
            <Title level={3} style={styles.metricValue}> {seller.totalOrders || 0} </Title>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Unshipped Orders</Text>
            <Title level={3} style={styles.metricValue}> {seller.unshippedOrders || 0} </Title>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Average Rating</Text>
            <Title level={3} style={styles.metricValue}> {seller.rating || 0} </Title>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Balance</Text>
            <Title level={3} style={styles.metricValue}>${seller.balance || '0.00'}</Title>
          </Card>
        </Col>
      </Row>

      {/* Seller Information Section */}
      <Row gutter={16}>
        <Col span={12}>
          <Card style={styles.card}>
            <Title level={4} style={styles.title}>Seller Information</Title>
            <Text style={styles.label}>Seller ID:</Text>
            <Text style={styles.value}>{seller.sellerId}</Text>
            <Divider />
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{seller.name}</Text>
            <Divider />
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{seller.email}</Text>
          </Card>
        </Col>

        <Col span={12}>
          <Card style={styles.card}>
            <Title level={4} style={styles.title}>Contact Details</Title>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{seller.phone}</Text>
            <Divider />
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{seller.address}</Text>
          </Card>
        </Col>
      </Row>

      {/* Shop Info Section */}
      <Row>
        <Col span={24}>
          <Card style={styles.card}>
            <Title level={4} style={styles.title}>Shop Information</Title>
            <Text style={styles.label}>Shop Name:</Text>
            <Text style={styles.value}>{seller.shopName}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: '#f4f6f9', // Light background
    minHeight: '100vh',
  },
  metricsRow: {
    marginBottom: '20px',
  },
  metricCard: {
    textAlign: 'center',
    background: '#003b6f', // Blue background
    color: '#fff',
    padding: '15px',
    borderRadius: '8px',
  },
  metricLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#f7b731',
  },
  metricValue: {
    color: '#fff',
    fontSize: '22px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow
    padding: '20px',
    color: '#333',
  },
  title: {
    color: '#003b6f',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333',
    display: 'block',
    marginTop: '10px',
  },
  value: {
    color: '#666',
    fontSize: '16px',
    marginTop: '5px',
    display: 'block',
  },
};

export default ProfilePage;
