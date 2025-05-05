import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Alert, Button, Input } from 'antd';
import { jsPDF } from 'jspdf';
import Layout from '../../Layout'

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    if (value === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(value.toLowerCase()) ||
        user.firstname.toLowerCase().includes(value.toLowerCase()) ||
        user.lastname.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

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
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input.Search
          placeholder="Search by email, first name, or last name"
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button 
          type="primary" 
          onClick={exportToPDF}
        >
          Export to PDF
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
    </Layout>
  );
};

export default UsersList;
