const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Importing routes
const categoryRoutes = require('./Src/routes/categoryRoutes');
const productRoutes = require('./Src/routes/productRoutes');
const videoRoutes = require('./Src/routes/shortsRoutes');
const paymentRoutes = require('./Src/routes/PaymentRoutes');
const webhookRoutes = require('./Src/routes/webhook');
const cartRoutes = require('./Src/routes/cartRoutes');
const userRoutes = require('./Src/routes//userRoutes'); // New route for user-related operations
const cardRoutes = require('./Src/routes/cardRoutes');
const pricardRoutes = require('./Src/routes/PriCardRoutes');


dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


  let savedDeadline = null; // To store the deadline temporarily

  // POST endpoint to save the deadline
  app.post('/api/deadline', (req, res) => {
    const { deadline } = req.body;
    if (!deadline) {
      return res.status(400).json({ message: 'Deadline is required' });
    }
    savedDeadline = deadline; // Save the deadline in memory
    console.log(`Deadline received: ${deadline}`);
    res.status(200).json({ message: 'Deadline saved successfully' });
  });
  
  // GET endpoint to retrieve the deadline
  app.get('/api/deadline', (req, res) => {
    if (!savedDeadline) {
      return res.status(404).json({ message: 'No deadline found' });
    }
    res.status(200).json({ deadline: savedDeadline });
  });

// Routes
app.use('/api/cat', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', webhookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes); // User routes
app.use('/api/card', cardRoutes);
app.use('/api/pricard', pricardRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
