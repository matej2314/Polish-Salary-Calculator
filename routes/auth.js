const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth'); // Sprawdź, czy ścieżka jest poprawna

router.post('/registeruser', authController.registeruser);
router.post('/login', authController.loginuser);

module.exports = router;
