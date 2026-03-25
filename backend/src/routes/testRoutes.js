const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

// Ruta GET /api/test/hello
router.get('/hello', testController.hello);

// Ruta GET /api/test/db
router.get('/db', testController.testDB);

module.exports = router;