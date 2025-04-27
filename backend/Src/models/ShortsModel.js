const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  videoURL: { type: String, required: true },
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
