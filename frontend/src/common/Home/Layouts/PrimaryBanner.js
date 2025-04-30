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
    margin-bottom: 5px; /* Reduce gap between title and description */
  }

  h2 {
    color: #004f9a;
    margin: 0; /* Remove default margin */
    font-size: 54px; /* Increase font size for title */

  }

  p {
    color: #004f9a;
  }
`;

// Add more layouts (L4, etc.) as needed...

const Page1 = () => {
  const [cards, setCards] = useState([]);
  const navigate=useNavigate();
  
  const handleCardClick = () => {
    navigate('/all-pro');
  };


  const L1Card = ({ card }) => (


    <CardContainer height="300px" onClick={handleCardClick}>
      <CardImage src={card.image} alt={card.title} />
      <TextContainer >
        <h1>{card.title}</h1>
        
        <div style={{ marginTop:'12px', fontSize:'19px'}}>{card.description}</div>
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

  // Ensure at least 10 cards and add labels
  const repeatedCards = [...cards, ...cards.slice(0, 10 - cards.length)].map((card, index) => ({
    ...card,
    label: `L${index + 1}`, // Assign unique labels
  }));

  // Sort cards by layout order
  const sortedCards = repeatedCards.sort((a, b) => {
    const layoutOrder = ['L1', 'L2', 'L3']; // Define your desired layout order
    return layoutOrder.indexOf(a.layout) - layoutOrder.indexOf(b.layout);
  });

  const renderCard = (card) => {
    switch (card.layout) {
      case 'L1':
        return <L1Card card={card} />;
      case 'L2':
        return <L1Card card={card} />;
      case 'L3':
        return <L1Card card={card} />;
      // Add more cases for L4, etc.
      default:
        return <L1Card card={card} />; // Fallback to L1 layout
    }
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
