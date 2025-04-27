import React, { useState, useEffect } from 'react';
import { Typography, Button, Row, Col } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CardContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 100%; /* Ensure cards take up full width of their container */
  height: 260px; /* Set consistent card height */
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

// Main Page Component
const Page1 = () => {
  const [cards, setCards] = useState([]); // To store the fetched cards from the backend
  const navigate = useNavigate();


  // Fetch stored cards
  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/card'); // Adjust endpoint as per your backend
      setCards(response.data);
    } catch (error) {
      console.log('Failed to fetch cards');
    }
  };

  // UseEffect to fetch cards when the component mounts
  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div style={{ margin: '0px', backgroundColor: '#f0f2f5' }} onClick={() => navigate(`/all-pro`)}>
      <Row gutter={[16, 16]}>
        {/* Left column */}
        <Col xs={24} md={9}>
          {cards.map(
            (card) =>
              card.layout === 'Left' && (
                <CardContainer key={card._id} style={{ height: '515px' }}>
                  <CardImage src={card.image} alt={card.title} />
                  <TextContainer>
                    <div>
                      <h1 style={{ color: '#004f9a', marginTop: '1px' }}>{card.title}</h1>
                      <Button type="link" style={{ color: '#004f9a' }}>
                        {card.description}
                      </Button>
                    </div>
                  </TextContainer>
                </CardContainer>
              )
          )}
        </Col>

        {/* Right column */}
        <Col xs={24} md={15}>
          <Row gutter={[16, 16]} style={{ height: '300px' }}>
            <Col xs={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {cards.map(
                (card) =>
                  card.layout === 'M1' && (
                    <CardContainer key={card._id} style={{ height: '240px' }}>
                      <CardImage src={card.image} alt={card.title} />
                      <TextContainer>
                        <div>
                          <h1 style={{ color: '#004f9a', marginTop: '1px' }}>{card.title}</h1>
                          <Button type="link" style={{ color: '#004f9a' }}>
                            {card.description}
                          </Button>
                        </div>
                      </TextContainer>
                    </CardContainer>
                  )
              )}
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                {['M2', 'M3'].map((layout) =>
                  cards.map(
                    (card) =>
                      card.layout === layout && (
                        <Col xs={12} key={card._id}>
                          <CardContainer>
                            <CardImage src={card.image} alt={card.title} />
                            <TextContainer>
                              <div>
                                <h1
                                  style={{
                                    color: '#004f9a',
                                    marginTop: '1px',
                                    fontSize: layout === 'M2' ? '20px' : '21px',
                                  }}
                                >
                                  {card.title}
                                </h1>
                                <Button type="link" style={{ color: '#004f9a' }}>
                                  {card.description}
                                </Button>
                              </div>
                            </TextContainer>
                          </CardContainer>
                        </Col>
                      )
                  )
                )}
              </Row>
            </Col>
            {cards.map(
              (card) =>
                card.layout === 'Right' && (
                  <Col xs={12}  md={12} key={card._id}>
                    <CardContainer style={{ height: '515px' }}>
                      <CardImage src={card.image} alt={card.title} />
                      <TextContainer>
                        <div>
                          <h1 style={{ color: '#004f9a', marginTop: '1px' }}>{card.title}</h1>
                          <Button type="link" style={{ color: '#004f9a' }}>
                            {card.description}
                          </Button>
                        </div>
                      </TextContainer>
                    </CardContainer>
                  </Col>
                )
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Page1;
