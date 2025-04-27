import React, { useState, useEffect } from 'react';
import { Layout, Result, Modal } from 'antd';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../cart/CartContext';
import LayoutNew from '../../Layout';
import imageSrc from '../../Images/logo.png';
//import StripImageSrc from '../../Images/StripeLogo.jpeg';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51QaAO003ldnatOZanoghUvQrw76T9rnCg0YxqQaPffhxmc2LCX5rA2iKSu1p74ApieFr76sZBeDg7dyH8rMBzIOu00XLfTyJPL');

const CheckoutForm = () => {
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [loading, setLoading] = useState(false); // Track the loading state
  const stripe = useStripe();
  const elements = useElements();
  const { reloadCart } = useCart();
  const navigate = useNavigate();


  useEffect(() => {
    for (const item of cart) {
      if (item.currentStocks < item.quantity) {
        setPaymentStatus(`Error: ${item.itemName} is out of stock.`);
        return;
      }
    }
  }, [cart]);
  
  useEffect(() => {
    const totalAmount = cart.reduce((total, item) => total + item.price * 100, 0);

    fetch('http://localhost:5000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalAmount }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [cart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements || !clientSecret || loading) {
      return; // Exit if the process is already ongoing
    }
  
    setLoading(true); // Set loading before processing payment
    const cardNumber = elements.getElement(CardNumberElement);
  
    setPaymentStatus('Processing...');
  
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: { name: 'Customer Name' },
      },
    });
  
    setLoading(false); // Reset loading after processing
  
    if (error) {
      setPaymentStatus(`Error: ${error.message}`);
    } else if (paymentIntent.status === 'succeeded') {
      setPaymentStatus('success');
      setIsModalVisible(true); // Show success modal
  
      try {
        const userId = localStorage.getItem('userId');
  
        // Calculate totalAmount and total for each cart item
        const cartWithTotals = cart.map(item => ({
          ...item,
          total: item.price * item.quantity * (1 - item.discount / 100), // Ensure `total` is included
        }));
        
        const totalAmount = cart.reduce((total, item) => {
//          console.log("Item:", item);
          return total + (item.total || (item.price * item.quantity) || 0);
        }, 0);
        
        /*  console.log('Sending Order Data:', {
            userId,
            cartItems: cartWithTotals,
            paymentIntentId: paymentIntent.id,
            totalAmount, 
            paymentStatus: paymentIntent.status,
          });*/

          const response = await fetch('http://localhost:5000/api/order/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              cartItems: cartWithTotals,
              paymentIntentId: paymentIntent.id,
              totalAmount, // Ensure totalAmount is sent
              paymentStatus: paymentIntent.status,
            }),
          });

        
        const result = await response.json();
       // console.log(result); // Log response for debugging
  
       // Reduce stock after successful payment
await Promise.all(
  cartWithTotals.map(async (item) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/updateStock/${item.productId._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantitySold: item.quantity }),
      });
      //console.log("Updating stock for:", item.productId);

      const data = await response.json();


    } catch (error) {
      console.error(`Error updating stock for ${item.itemName}:`, error);
    }
  })
);

  
        // Clear the cart
        await fetch('http://localhost:5000/api/cart/clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
  
        reloadCart();
      } catch (error) {
        console.error('Failed to store order or clear cart:', error);
      }
    } else {
      setPaymentStatus('Payment failed. Please try again.');
    }
  };
  

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigate('/home'); 
  };

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <LayoutNew>
      <Layout>
        <br />
        <form onSubmit={handleSubmit} style={formStyles}>
          <div style={{ width: '400px', height: '500px', textAlign: 'left' }}>
            <div style={{ marginBottom: '30px' }}>
            <img
                src={imageSrc}
                alt="Logo"
                style={{ marginLeft: '15px', marginBottom: '3px', width: '100px', height: '100px' }}
              />
          {/*      <span>
                <img
                  src={StripImageSrc}
                  alt="Logo"
                  style={{ marginLeft: '100px', width: '180px', height: '100px' }}
                />
              </span>*/}
            </div>

            <div style={formGroupStyles}>
              <label htmlFor="card-element" style={labelStyles}>Card Number</label>
              <CardNumberElement id="card-element" options={cardStyle} style={cardElementStyles} />
            </div>
            <div style={formGroupStyles}>
              <label htmlFor="card-expiry" style={labelStyles}>Expiration Date</label>
              <CardExpiryElement id="card-expiry" options={cardStyle} style={cardElementStyles} />
            </div>
            <div style={formGroupStyles}>
              <label htmlFor="card-cvc" style={labelStyles}>CVC</label>
              <CardCvcElement id="card-cvc" options={cardStyle} style={cardElementStyles} />
            </div>
            <button type="submit" style={payButtonStyles} disabled={!stripe || !clientSecret || loading}>
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
          {paymentStatus && paymentStatus !== 'Processing...' && (
            <p style={statusStyles}>{paymentStatus}</p>
          )}
        </form>

        {/* Success Modal */}
        <Modal
          title="Payment Successful"
          open={isModalVisible}
          onOk={handleModalClose}
          onCancel={handleModalClose}
          footer={null}
        >
          <p>Your payment has been processed successfully.</p>
          <button
            style={{ ...payButtonStyles, backgroundColor: '#28a745' }}
            onClick={handleModalClose}
          >
            Close
          </button>
        </Modal>
      </Layout>
    </LayoutNew>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

// Inline Styles
const formStyles = {
  maxWidth: '800px',
  margin: '0 auto',
  paddingTop: '50px',
  paddingLeft: '70px',
  paddingRight: '50px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  fontSize: '20px',
  textAlign: 'left',
};

const formGroupStyles = {
  marginBottom: '20px',
  marginLeft: '20px',
};

const labelStyles = {
  display: 'block',
  marginBottom: '20px',
  fontWeight: 'normal',
};

const cardElementStyles = {
  width: '100%',
  padding: '15px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '18px',
};

const payButtonStyles = {
  backgroundColor: '#004f9a',
  color: 'white',
  padding: '16px',
  width: '100%',
  border: 'none',
  borderRadius: '4px',
  fontSize: '18px',
  cursor: 'pointer',
};

const statusStyles = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '16px',
  color: '#333',
};

export default Checkout;
