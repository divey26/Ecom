const mongoose = require('mongoose');
const Product = require('./Src/models/productModel');
const Seller = require('./Src/models/sellerModel'); // Assuming you have a Seller model

mongoose.connect('mongodb+srv://signature:alex20020226@sb.nclisq7.mongodb.net/SWEET?retryWrites=true&w=majority&appName=SB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    updateExistingProducts(); // Call function once connected
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

async function updateExistingProducts() {
  try {
    const defaultSeller = await Seller.findOne({ sellerId: 'SE0001' }); // Find seller by sellerId
    if (!defaultSeller) {
      console.log('Seller not found');
      mongoose.connection.close();
      return;
    }

    // Update products that do not have a sellerId
    const result = await Product.updateMany(
      { sellerId: { $exists: false } }, // Find products without sellerId
      { $set: { sellerId: defaultSeller._id } } // Set sellerId to defaultSeller's _id
    );

    console.log(`Updated ${result.nModified} products with sellerId`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating products:', error);
    mongoose.connection.close();
  }
}
