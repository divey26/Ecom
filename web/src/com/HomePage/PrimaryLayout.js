import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Form, message, Select, Table, Modal } from 'antd';
import axios from 'axios';
import { storage } from '../../Firebase/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [layout, setLayout] = useState('default');
  const [cards, setCards] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // Card being edited
  const [existingLayouts, setExistingLayouts] = useState(new Set());
  const [form] = Form.useForm(); // Ant Design form instance
  const fileInputRef = useRef(null); // Ref for file input

  // Columns for the Table
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="Card" style={{ width: '100px' }} />,
    },
    {
      title: 'Layout',
      dataIndex: 'layout',
      key: 'layout',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pricard');
      setCards(response.data);
      const layouts = new Set(response.data.map((card) => card.layout));
      setExistingLayouts(layouts);
    } catch (error) {
      console.log('Failed to fetch cards');
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleImageUpload = async (file) => {
    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!supportedTypes.includes(file.type)) {
      message.error('Unsupported file type');
      return;
    }

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `cards/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          message.error('Failed to upload image');
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadURL);
          setIsUploading(false);
          message.success('Image uploaded successfully');
        }
      );
    } catch (error) {
      message.error('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !image || !layout) {
      message.error('Please fill all fields');
      return;
    }

    const data = { title, description, image, layout };

    try {
      await axios.post('http://localhost:5000/api/pricard', data);
      message.success('Card saved successfully');
      form.resetFields();
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTitle('');
      setDescription('');
      setLayout('default');
      fetchCards();
      setIsModalVisible(false);
    } catch (error) {
      console.log('Error during form submission:', error);
      message.error('Failed to save card');
    }
  };

  const handleEditSubmit = async () => {
    if (!title || !description || !image) {
      message.error('Please fill all fields');
      return;
    }

    const updatedData = { title, description, image };

    try {
      await axios.put(`http://localhost:5000/api/pricard/${editingCard._id}`, updatedData);
      message.success('Card updated successfully');
      fetchCards();
      setIsEditModalVisible(false);
      setEditingCard(null);
      setImage(null);
    } catch (error) {
      console.log('Error updating card:', error);
      message.error('Failed to update card');
    }
  };

  const handleEdit = (record) => {
    setEditingCard(record);
    setTitle(record.title);
    setDescription(record.description);
    setImage(record.image);
    setLayout(record.layout);
    setIsEditModalVisible(true);
  };

  return (
    <>
      <div style={{ padding: '20px', borderTop: '2px solid gray' }}>
        <h2>Primary Layout</h2>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          disabled={existingLayouts.size === 10}
        >
          Add +
        </Button>

        <Modal
          title="Add New Card"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item label="Title" name="title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Item>
            <Form.Item label="Layout" name="layout">
              <Select
                value={layout}
                onChange={(value) => setLayout(value)}
                style={{ width: '100%' }}
              >
                {Array.from({ length: 10 }, (_, i) => `L${i + 1}`).map((layout) => (
                  <Select.Option key={layout} value={layout}>
                    {layout} card
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Image">
              <input
                type="file"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                accept="image/*"
                ref={fileInputRef}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isUploading}>
              Save
            </Button>
          </Form>
        </Modal>

        <Modal
          title="Edit Card"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleEditSubmit}>
            <Form.Item label="Title" name="title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Item>
            <Form.Item label="Image">
              <input
                type="file"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                accept="image/*"
                ref={fileInputRef}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isUploading}>
              Update
            </Button>
          </Form>
        </Modal>

        <div style={{ marginTop: '20px' }}>
          <Table columns={columns} dataSource={cards} rowKey="_id" />
        </div>
      </div>
    </>
  );
};

export default AdminPage;
