const express = require('express');
const authController = require('../controllers/auth.js');
const router = express.Router();

router.post('/register', authController.registeruser);

module.exports = router;
