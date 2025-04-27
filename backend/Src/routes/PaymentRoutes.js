/*const express = require('express');
const stripe = require('stripe')('sk_test_51QaAO003ldnatOZap5OtFS1TLroFsCobZKQMTvyTAXxygESWlglGXGbX1KnUg6fo4e1ZZ4VKuXsgg3qvcGP8imSy00qWLmiR6f'); // Replace with your secret key
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // Amount in cents
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd', // or your local currency
        payment_method_types: ['card'],
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,  // Ensure this is sent correctly
      });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
  

module.exports = router;
*/


// /server/routes/paymentRoutes.js
const express = require('express');
const { createPaymentIntent } = require('../controllers/PaymentController'); // Import controller
const router = express.Router();

// Define the payment route
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
