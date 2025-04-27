import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message, Modal, Input } from 'antd';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Title } = Typography;

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hideDiscount, setHideDiscount] = useState(false);

  // Fetch Products from API
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

  // Calculate Dynamic Discount
  const calculateDynamicDiscount = (values) => {
    const { initialStocks, currentStocks } = values;
    const stockPercentage = (currentStocks / initialStocks) * 100;

    if (stockPercentage > 75) return 0;
    if (stockPercentage > 50) return 5;
    if (stockPercentage > 25) return 8;
    if (stockPercentage > 15) return 10;
    return 12;
  };

  // Handle Edit
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  // Save Edited Product
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

  // Handle Delete
  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter((product) => product.productId !== productId));
      message.success('Product deleted successfully');
    } catch (error) {
      message.error('Error deleting product');
    }
  };

  // Handle Stock Change
  const handleCurrentStockChange = (e) => {
    const updatedProduct = { ...editingProduct, currentStocks: e.target.value };
    updatedProduct.discount = calculateDynamicDiscount(updatedProduct);
    setEditingProduct(updatedProduct);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Products List', 20, 10);

    const tableColumn = ['Product ID', 'Item Name', 'Price', 'Discount', 'Initial Stocks', 'Current Stocks', 'Seller ID'];
    const tableRows = products.map(({ productId, itemName, price, discount, initialStocks, currentStocks, sellerId }) => [
      productId,
      itemName,
      `$${price}`,
      `${discount}%`,
      initialStocks,
      currentStocks,
      sellerId,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('products_list.pdf');
  };

  // Table Columns
  const columns = [
    { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
    { title: 'Item Name', dataIndex: 'itemName', key: 'itemName' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text}` },
    { title: 'Discount', dataIndex: 'discount', key: 'discount', render: (text) => `${text}%` },
    { title: 'Initial Stocks', dataIndex: 'initialStocks', key: 'initialStocks' },
    { title: 'Current Stocks', dataIndex: 'currentStocks', key: 'currentStocks',
      render: (stocks) => (
        <span style={{ color: stocks < 5 ? 'red' : 'green', fontWeight: 'bold' }}>
          {stocks}
        </span>
      ),
    },
    { title: 'Seller ID', dataIndex: 'sellerId', key: 'sellerId' },
    { 
      title: 'Actions', key: 'actions',
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
      <Button type="primary" onClick={exportToPDF} style={{ marginBottom: 10 }}>
        Export to PDF
      </Button>
      <Table columns={columns} dataSource={products} rowKey="productId" loading={loading} pagination={{ pageSize: 10 }} />

      {/* Edit Modal */}
      <Modal title="Edit Product" open={isEditing} onCancel={() => setIsEditing(false)} onOk={handleSaveEdit}>
        <div>
          <div style={{ marginBottom: 10 }}>
            <label>Item Name</label>
            <Input
              value={editingProduct?.itemName}
              onChange={(e) => setEditingProduct({ ...editingProduct, itemName: e.target.value })}
              placeholder="Item Name"
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Price</label>
            <Input
              value={editingProduct?.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              placeholder="Price"
            />
          </div>

          {!hideDiscount && (
            <div style={{ marginBottom: 10 }}>
              <label>Discount</label>
              <Input
                value={editingProduct?.discount}
                onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })}
                placeholder="Discount"
                disabled
              />
            </div>
          )}

          <div style={{ marginBottom: 10 }}>
            <label>Description</label>
            <Input
              value={editingProduct?.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              placeholder="Description"
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Initial Stocks</label>
            <Input
              value={editingProduct?.initialStocks}
              disabled
              placeholder="Initial Stocks"
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Current Stocks</label>
            <Input
              value={editingProduct?.currentStocks}
              onChange={handleCurrentStockChange}
              placeholder="Current Stocks"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsList;
