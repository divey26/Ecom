const Product = require('../models/productModel');

exports.createProduct = async (req, res) => {
  try {
    const { productId, itemName, category, subcategory, price, rating, offerName, discount, description, imageURL } = req.body;

    const newProduct = new Product({
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
  
  // productController.js

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
  

  exports.getprocate = async (req, res) => {
    const { categoryId } = req.query;
    try {
      const products = await Product.find({ categoryId });
      res.json({ products });
    } catch (error) {
      res.status(500).send('Error fetching products');
    }
  };
  