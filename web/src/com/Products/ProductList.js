import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message, Modal, Input } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        message.error('Error fetching products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Edit button click
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    try {
      const updatedProduct = await axios.put(
        `http://localhost:5000/api/products/${editingProduct.productId}`,
        editingProduct
      );

      setProducts(products.map((p) => (p.productId === updatedProduct.data.product.productId ? updatedProduct.data.product : p)));
      setIsEditing(false);
      setEditingProduct(null);
      message.success('Product updated successfully');
    } catch (error) {
      message.error('Error updating product');
    }
  };

  // Handle Delete button click
  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter((product) => product.productId !== productId));
      message.success('Product deleted successfully');
    } catch (error) {
      message.error('Error deleting product');
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text}`, // Format price as currency
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'imageURL',
      key: 'imageURL',
      render: (imageURL) => <img src={imageURL} alt="Product" style={{ width: 50, height: 50 }} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button onClick={() => handleEditClick(record)} type="primary">
            Edit
          </Button>
          <Button onClick={() => handleDeleteClick(record.productId)} type="danger">
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Products List</Title>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="productId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal for Editing Product */}
      <Modal
        title="Edit Product"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        onOk={handleSaveEdit}
      >
        <div>
          <Input
            value={editingProduct?.itemName}
            onChange={(e) => setEditingProduct({ ...editingProduct, itemName: e.target.value })}
            placeholder="Item Name"
          />
          <Input
            value={editingProduct?.price}
            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
            placeholder="Price"
            style={{ marginTop: 10 }}
          />
          <Input
            value={editingProduct?.discount}
            onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })}
            placeholder="Discount"
            style={{ marginTop: 10 }}
          />
          <Input
            value={editingProduct?.description}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            placeholder="Description"
            style={{ marginTop: 10 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProductsList;
