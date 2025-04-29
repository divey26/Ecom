const Product = require('../models/productModel');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  try {
    const { sellerId, productId, itemName, category, subcategory, price, rating, offerName, discount, description, imageURL, initialStocks } = req.body;

    // Ensure required fields exist
    if (!sellerId || !productId || !itemName || !category || !subcategory || !price || !rating || !offerName || !discount || !description || !imageURL || initialStocks === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new product with correct fields
    const newProduct = new Product({
      sellerId,  // Ensure sellerId is stored
      productId,
      itemName,
      category,
      subcategory,
      price,
      rating,
      offerName,
      discount,
      description,
      imageURL,
      initialStocks,
      currentStocks: initialStocks,  // Ensure currentStocks is set properly
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product saved successfully!', product: newProduct });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving product data' });
  }
};



exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};


  exports.getProductById = async (req, res) => {
    const { productId } = req.params; // Get productId from the URL
  
    try {
      // Find the product by productId (not by _id)
      const product = await Product.findOne({ productId: productId });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching product details' });
    }
  };
  


  // productController.js

  exports.editProduct = async (req, res) => {
    const { productId } = req.params; // Get productId from the URL
    const updateData = req.body; // Get updated product data from the request body
    
    try {
      // Find the product by productId (not by _id)
      const updatedProduct = await Product.findOneAndUpdate(
        { productId: productId }, // Match the productId in the database
        updateData, // Updated data
        { new: true } // Return the updated product
      );
    
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
    
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating product' });
    }
  };
  

  exports.deleteProduct = async (req, res) => {
    const { productId } = req.params; // Get productId from the URL
    
    try {
      // Find and delete product by productId
      const deletedProduct = await Product.findOneAndDelete({ productId: productId });
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting product' });
    }
  };
  

  
  // productController.js
  exports.updateStock = async (req, res) => {
    const { productId } = req.params; // productId from URL parameter
    const { quantitySold } = req.body; // quantitySold from request body
    
   // console.log('Received productId:', productId);  // Log the received productId
    const objectId = new mongoose.Types.ObjectId(productId);

    try {
      const product = await Product.findById(objectId);
    
      if (!product) {
        console.log('Product not found');
        return res.status(404).json({ message: 'Product not found' });
      }
    
      if (product.currentStocks < quantitySold) {
        console.log('Insufficient stock');
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    
      product.currentStocks -= quantitySold;
      await product.save();
      
     // console.log(`Stock updated successfully: New stock = ${product.currentStocks}`);
      res.status(200).json({ message: 'Stock updated successfully', product });
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({ message: 'Error updating stock' });
    }
  };
  


  exports.getprocate = async (req, res) => {
    const { categoryId } = req.query;
    try {
      const products = await Product.find({ categoryId });
      res.json({ products });
    } catch (error) {
      res.status(500).send('Error fetching products');
    }
  };

  exports.getProductByObjectId = async (req, res) => {
    const { objectId } = req.params; // Get objectId from the URL
    
    try {
      const product = await Product.findById(objectId); // Use the ObjectId to find the product
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
//      console.log('Fetched product details:', product); // Log product details
      
      res.status(200).json({ product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching product by ObjectId' });
    }
  };
  





