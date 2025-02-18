const Video = require('../models/ShortsModel');
const Product = require('../models/productModel'); 

// Controller to add video URL and productId to the database
const addVideo = async (req, res) => {
  const { productId, videoURL } = req.body;

  try {
    // Create a new video document
    const newVideo = new Video({
      productId,
      videoURL,
    });

    // Save the new video to the database
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ message: error.message });
  }
};


// Controller to fetch video URL by productId
const getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product associated with the productId
    const product = await Product.findOne({ productId });

    /*if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }*/

    // Send the product details in the response
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};


// Controller to fetch all videos with respective productIds
const getAllVideos = async (req, res) => {
  try {
    // Fetch all videos from the database
    const videos = await Video.find();

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found' });
    }

    // Send the list of videos in the response
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addVideo, getProductById, getAllVideos };
