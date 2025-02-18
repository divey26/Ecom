import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, message } from 'antd';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();


  const fetchVideos = async () => {
    try {
      // Fetch video data from the API
      const videoResponse = await axios.get('http://localhost:5000/api/videos/get-all-videos');
      const videoData = videoResponse.data;
  
      const videosWithDetails = await Promise.all(
        videoData.map(async (video) => {
          try {            
            // Fetch product details from the API
            const productResponse = await axios.get(`http://localhost:5000/api/products/${video.productId}`);
            const product = productResponse.data.product; // Accessing the 'product' field
  
            // Check if product data is valid
            const productName = product.itemName ? product.itemName : 'Unknown Product';
            const price = product.price ? product.price : 'N/A';
            const imageURL = product.imageURL ? product.imageURL : '';
  
            // Return the video object with product details
            return {
              ...video,
              productName,
              price,
              imageURL,
              productId: video.productId,
              isPlaying: false,
            };
  
          } catch (error) {
            console.error(`Error fetching product details for productId: ${video.productId}`, error);
            return {
              ...video,
              productName: 'Unknown Product',
              price: 'N/A',
              imageURL: '',
              productId: video.productId,
              isPlaying: false,
            };
          }
        })
      );
  
      setVideos(videosWithDetails);
  
    } catch (error) {
      console.error('Error fetching videos:', error);
      message.error('Failed to fetch videos. Please try again.');
    }
  };
  
  const handleMouseEnter = (videoId) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video._id === videoId ? { ...video, isPlaying: true } : video
      )
    );
  };

  const handleMouseLeave = (videoId) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video._id === videoId ? { ...video, isPlaying: false } : video
      )
    );
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Layout>
    
    <Title level={3} style={{ textAlign: 'left', marginTop: '50px', marginBottom: '0px'}}>Featured in videos</Title>
    <Text style={{ color: "black", textAlign: "left", fontSize: "14px", marginTop: '0', marginBottom: '10px' }}>See what creators are sharing</Text>

    <div 
      style={{ 
        Width: '1200px',
        backgroundColor:"#004f9a",
        paddingBottom:"90px",
        marginTop:"8px",
        border:"1px solidrgba(4, 77, 146, 0.38)",
        padding:"10px"
        }}

        >
       <Row gutter={[8, 16]} justify="center" style={{ paddingLeft: 0, paddingRight: 0 }}>
        {videos.map((video) => (
          <Col xs={12} sm={12} md={8} lg={4} xl={4} key={video._id}>
            <div
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#ffffff',

              }}
              onMouseEnter={() => handleMouseEnter(video._id)}
              onMouseLeave={() => handleMouseLeave(video._id)}
              onClick={() => navigate(`/product/${video.productId}`)} // Navigate on card click

            >
              {/* Video Section */}
              <div style={{ position: 'relative', paddingBottom: '177%', height: 0 }}>
                <ReactPlayer
                  url={video.videoURL}
                  playing={video.isPlaying}
                  loop
                  muted
                  controls={false}
                  width="100%"
                  height="100%"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
              </div>

              {/* Product Details Section */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  gap: '10px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                }}

                onClick={() => navigate(`/product/${video.productId}`)} // Navigate on card click

              >
                {/* Product Image */}
                {video.imageURL && (
                  <img
                    src={video.imageURL}
                    alt={video.productName}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                )}

                {/* Product Details */}
                <div style={{ textAlign: 'left', maxWidth: 'calc(100% - 70px)' }}>
                  <Title
                    level={5}
                    style={{
                      marginBottom: '5px',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    ${video.price}
                  </Title>
                  <Text
                    style={{
                      color: '#555',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {video.productName}
                  </Text>
                </div>
              </div>
            </div>
          </Col>
        ))}
    </Row>

      </div>
    </Layout>
  );
};

export default HomePage;
