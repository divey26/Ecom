const express = require('express');
const { saveCardData, getAllCards, updateCardData} = require('../controllers/PriCardController');
const router = express.Router();

router.post('/', saveCardData);
router.get('/', getAllCards);  // This is the route you are trying to access
router.put('/:id', updateCardData); // New route for updating a card

module.exports = router;
