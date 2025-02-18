import React, { useState, useEffect } from 'react'; // For useState and useEffect
import { Row, Col, Card as AntCard, message, Typography } from 'antd';
import styled from 'styled-components';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cat');
      setCategories(response.data); // Store categories from the API
    } catch (error) {
      console.error('Error fetching categories:', error.response ? error.response.data : error.message);
      message.error('Failed to fetch categories. Please try again.');
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
  }, []);

  return (
    <ContentWrapper>
      <Row gutter={[16, 16]} justify="center">
        {categories.map((category) => (
          <Col xs={12} sm={10} md={8} lg={6} xl={3} key={category.categoryId}>
            <StyledCard
              hoverable
              cover={<img alt={category.categoryName} src={category.imageURL} />}
              onClick={() => navigate(`/all-pro/${category.categoryId}`)} // Navigate to Pro.js with category ID
            >
              <TitleStyle level={5}>{category.categoryName}</TitleStyle>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </ContentWrapper>
  );
};

// Styled Components
const ContentWrapper = styled.div`
  margin: 50px 0 20px 0;
`;

const StyledCard = styled(AntCard)`
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 250px;
  padding: 5px;

  .ant-card-cover img {
    height: 140px;
    object-fit: cover;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .ant-card-body {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
  }
`;

const TitleStyle = styled(Title)`
  text-align: center;
  margin-top: 1px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export default Categories;
