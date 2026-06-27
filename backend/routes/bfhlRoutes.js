const express = require('express');
const router = express.Router();
const { postBfhl, getBfhl } = require('../controllers/bfhlController');

// Define routes for /bfhl
router.post('/', postBfhl);
router.get('/', getBfhl);

module.exports = router;
