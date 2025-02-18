// /server/controllers/paymentController.js
const stripe = require('stripe')('sk_test_51QaAO003ldnatOZap5OtFS1TLroFsCobZKQMTvyTAXxygESWlglGXGbX1KnUg6fo4e1ZZ4VKuXsgg3qvcGP8imSy00qWLmiR6f'); // Replace with your secret key

// Create payment intent
const createPaymentIntent = async (req, res) => {
  const { amount } = req.body; // Amount in cents
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // or your local currency
      payment_method_types: ['card'],
    });
    
    res.send({
      clientSecret: paymentIntent.client_secret, // Send the client_secret back to the frontend
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { createPaymentIntent };
