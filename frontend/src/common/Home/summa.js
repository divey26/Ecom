import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import axios from 'axios';

const CardContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  height: ${(props) => props.height || '260px'};
  color: #ffffff;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const TextContainer = styled.div`
  position: relative;
  z-index: 3;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Page1 = () => {
  const [cards, setCards] = useState([]);

  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/card');
      setCards(response.data);
    } catch (error) {
      console.log('Failed to fetch cards');
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Ensure at least 10 cards
  const repeatedCards = [...cards, ...cards.slice(0, 10 - cards.length)];

  return (
    <div style={{ margin: '0px', backgroundColor: '#f0f2f5', padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {/* Top Row */}
        <Col xs={24} md={6}>
          <CardContainer height="300px">
            <CardImage src={repeatedCards[0]?.image} alt={repeatedCards[0]?.title} />
            <TextContainer>
              <h1>{repeatedCards[0]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        <Col xs={24} md={12}>
          <CardContainer height="300px">
            <CardImage src={repeatedCards[1]?.image} alt={repeatedCards[1]?.title} />
            <TextContainer>
              <h1>{repeatedCards[1]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        <Col xs={24} md={6}>
          <CardContainer height="300px">
            <CardImage src={repeatedCards[2]?.image} alt={repeatedCards[2]?.title} />
            <TextContainer>
              <h1>{repeatedCards[2]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        {/* Second Row */}
        <Col xs={12} md={6}>
          <CardContainer height="200px">
            <CardImage src={repeatedCards[3]?.image} alt={repeatedCards[3]?.title} />
            <TextContainer>
              <h1>{repeatedCards[3]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        <Col xs={12} md={6}>
          <CardContainer height="200px">
            <CardImage src={repeatedCards[4]?.image} alt={repeatedCards[4]?.title} />
            <TextContainer>
              <h1>{repeatedCards[4]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        <Col xs={12} md={6}>
          <CardContainer height="200px">
            <CardImage src={repeatedCards[5]?.image} alt={repeatedCards[5]?.title} />
            <TextContainer>
              <h1>{repeatedCards[5]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        <Col xs={12} md={6}>
          <CardContainer height="200px">
            <CardImage src={repeatedCards[6]?.image} alt={repeatedCards[6]?.title} />
            <TextContainer>
              <h1>{repeatedCards[6]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        {/* Third Row */}
        <Col xs={8} md={8}>
          <CardContainer height="150px">
            <CardImage src={repeatedCards[7]?.image} alt={repeatedCards[7]?.title} />
            <TextContainer>
              <h1>{repeatedCards[7]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        <Col xs={8} md={8}>
          <CardContainer height="150px">
            <CardImage src={repeatedCards[8]?.image} alt={repeatedCards[8]?.title} />
            <TextContainer>
              <h1>{repeatedCards[8]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>

        <Col xs={8} md={8}>
          <CardContainer height="150px">
            <CardImage src={repeatedCards[9]?.image} alt={repeatedCards[9]?.title} />
            <TextContainer>
              <h1>{repeatedCards[9]?.title}</h1>
            </TextContainer>
          </CardContainer>
        </Col>
      </Row>
    </div>
  );
};

export default Page1;
