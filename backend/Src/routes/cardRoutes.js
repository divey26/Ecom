const express = require('express');
const { saveCardData, getAllCards } = require('../controllers/cardController');
const router = express.Router();

router.post('/', saveCardData);
router.get('/', getAllCards);  // This is the route you are trying to access

module.exports = router;
