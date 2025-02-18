const express = require('express');
const stripe = require('stripe')('sk_test_51QaAO003ldnatOZap5OtFS1TLroFsCobZKQMTvyTAXxygESWlglGXGbX1KnUg6fo4e1ZZ4VKuXsgg3qvcGP8imSy00qWLmiR6f'); // Replace with your secret key
const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'your-webhook-secret'; // Replace with your webhook secret
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event (e.g., payment_intent.succeeded)
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      // Handle the payment success logic here (e.g., update database, send email)
      break;
    // Add other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = router;
