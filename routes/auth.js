const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/registeruser', authController.registeruser);
router.post('/login', authController.loginuser);

module.exports = router;
