import React, { useState, useEffect } from 'react';
import { Layout, Space ,Typography,Button, Form, Input, Upload, message, Table, Modal } from 'antd';
import { storage } from '../../Firebase/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import LayoutNew from '../../Layout';
import { StockOutlined } from '@ant-design/icons';
const { Title } = Typography;




const AddShortsPage = () => {
  const [productId, setProductId] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videos, setVideos] = useState([]); // To store fetched videos
  const [isModalVisible, setIsModalVisible] = useState(false); // To control modal visibility

  // Fetch all videos from the backend
  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videos/get-all-videos');
      setVideos(response.data); // Assuming the API returns all videos
    } catch (error) {
      message.error('Failed to fetch videos.');
    }
  };

  useEffect(() => {
    fetchVideos(); // Fetch videos when the component mounts
  }, []);

  // Handle video file change
  const handleVideoChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setVideoFile(fileList[0].originFileObj);
    } else {
      setVideoFile(null);
    }
  };

  // Upload video to Firebase
  const handleUploadVideo = async (file) => {
    if (!file) {
      message.error('No video selected for upload.');
      return null;
    }

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `videos/${file.name}`);
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
              message.success('Video upload successful!');
              setIsUploading(false);
              resolve(downloadURL);
            } catch (error) {
              message.error(`Failed to retrieve video URL: ${error.message}`);
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

  // Handle form submit
// Handle form submit
const handleSubmit = async () => {
    if (!productId || !videoFile) {
      message.error('Please provide a Product ID and select a video file.');
      return;
    }
  
    // Upload the video directly, without checking the product in the database
    const videoURL = await handleUploadVideo(videoFile);
  
    if (videoURL) {
      try {
        const response = await axios.post('http://localhost:5000/api/videos/add-video', {
          productId,
          videoURL
        });
        message.success('Video uploaded successfully!');
        fetchVideos(); // Refresh the video list
        setIsModalVisible(false); // Close the modal
      } catch (error) {
        message.error('Failed to update product with video.');
      }
    }
  };
  

  // Table columns
  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Video URL',
      dataIndex: 'videoURL',
      key: 'videoURL',
      render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">Watch Video</a>,
    },
  ];

  return (
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
                Shorts
              </Title>
            </Space>
            <Button type="primary" onClick={() => setIsModalVisible(true)} style={{backgroundColor:"#ffc221",color:"black"}}>
                Add Shorts
            </Button>
            
          </Space>

    


        {/* Modal for adding video */}
        <Modal
          title="Add Video"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleSubmit}
          confirmLoading={isUploading}
        >
          <Form layout="vertical">
            <Form.Item
              label="Product ID"
              required
            >
              <Input
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Enter product ID"
              />
            </Form.Item>

            <Form.Item
              label="Upload Video"
              required
            >
              <Upload
                accept="video/*"
                beforeUpload={(file) => false}  // Disable automatic upload
                onChange={handleVideoChange}
              >
                <Button>Upload Video</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        <br/><br/><br/><br/>
        <span style={{marginLeft:"30px"}}><h3>Uploaded Videos</h3></span>
        <Table dataSource={videos} columns={columns} rowKey="_id" />
    </Layout>
    </LayoutNew>

  );
};

export default AddShortsPage;
