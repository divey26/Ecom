const Card = require('../models/PriCardModel');

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


// Update card data
const updateCardData = async (req, res) => {
  const { id } = req.params;
  const { title, description, image } = req.body;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true } // Return the updated document
    );

    if (!updatedCard) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    res.status(200).json({ success: true, message: 'Card updated successfully', updatedCard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

module.exports = { saveCardData, getAllCards, updateCardData };
