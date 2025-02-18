const Card = require('../models/cardModel');

// Save card data to MongoDB
const saveCardData = async (req, res) => {
  const { title, description, image, layout } = req.body; // Include layout here

  try {
    const newCard = new Card({
      title,
      description,
      image,
      layout, // Save the layout as well
    });

    await newCard.save();
    res.status(200).json({ success: true, message: 'Card saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all card data
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find(); // Get all cards from MongoDB
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { saveCardData, getAllCards };
