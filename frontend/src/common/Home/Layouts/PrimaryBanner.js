import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CardContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  height: ${(props) => props.height || '260px'};
  text-align: left;
  color: #004f9a;
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
  padding: 2px;
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;

  h1 {
    color: #004f9a;
    margin-bottom: 5px;
  }

  h2 {
    color: #004f9a;
    margin: 0;
    font-size: 54px;
  }

  p {
    color: #004f9a;
  }
`;

const Page1 = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/all-pro');
  };

  const L1Card = ({ card }) => (
    <CardContainer height="300px" onClick={handleCardClick}>
      <CardImage src={card.image} alt={card.title} />
      <TextContainer>
        <h1>{card.title}</h1>
        <div style={{ marginTop: '12px', fontSize: '19px' }}>{card.description}</div>
      </TextContainer>
    </CardContainer>
  );

  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pricard');
      setCards(response.data);
    } catch (error) {
      console.log('Failed to fetch cards');
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Remove duplicates based on _id (or another unique key)
  const uniqueCards = [...new Map(cards.map(card => [card._id, card])).values()];

  // Pad to 10 cards if needed
  const paddedCards = uniqueCards.length < 10
    ? [...uniqueCards, ...Array(10 - uniqueCards.length).fill(null).map((_, i) => uniqueCards[i % uniqueCards.length])]
    : uniqueCards;

  // Add labels
  const labeledCards = paddedCards.map((card, index) => ({
    ...card,
    label: `L${index + 1}`,
  }));

  // Sort by layout priority
  const sortedCards = labeledCards.sort((a, b) => {
    const layoutOrder = ['L1', 'L2', 'L3'];
    return layoutOrder.indexOf(a.layout) - layoutOrder.indexOf(b.layout);
  });

  const renderCard = (card) => {
    if (!card) return null; // guard against nulls in padded cards
    return <L1Card card={card} />;
  };

  return (
    <div style={{ margin: '0px', backgroundColor: '#f0f2f5', padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {sortedCards.map((card, index) => (
          <Col
            key={index}
            xs={index < 3 ? 24 : 12}
            md={index < 3 ? (index === 1 ? 12 : 6) : (index < 7 ? 6 : 8)}
          >
            {renderCard(card)}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Page1;
