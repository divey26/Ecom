import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Alert, Button } from 'antd';
import { jsPDF } from 'jspdf';
import Layout from '../../Layout'

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/users');
        setUsers(response.data); // Store fetched users in the state
      } catch (err) {
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  // Ant Design Table columns configuration
  const columns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'First Name', dataIndex: 'firstname', key: 'firstname' },
    { title: 'Last Name', dataIndex: 'lastname', key: 'lastname' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
  ];

  // Function to export table data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('User List', 14, 16);
    
    // Add table data
    const tableColumn = ['Email', 'First Name', 'Last Name', 'Phone', 'Address'];
    const tableRows = users.map(user => [
      user.email,
      user.firstname,
      user.lastname,
      user.phone,
      user.address,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Start the table below the title
    });

    doc.save('user_list.pdf'); // Save as PDF
  };

  return (
    <Layout>
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>User List</h2>
      {error && (
        <Alert message={error} type="error" style={{ marginBottom: '20px' }} />
      )}
      <Button 
        type="primary" 
        onClick={exportToPDF} 
        style={{ marginBottom: '20px' }}
      >
        Export to PDF
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
    </Layout>
  );
};

export default UsersList;
