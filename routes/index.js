var express = require('express');
var router = express.Router();
const AC = require('../controller/adminController');

// ✅ Apply JWT middleware to protect routes
router.post('/createAdmin', AC.createAdmin);
router.post('/login', AC.adminLogin);

module.exports = router;

