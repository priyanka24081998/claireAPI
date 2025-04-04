var express = require('express');
var router = express.Router();
const AC = require('../controller/adminController');

router.get("/", (req, res) => {
    res.send("Welcome to Claire API! 🎉");
  });

// ✅ Apply JWT middleware to protect routes
router.post('/createAdmin', AC.createAdmin);
router.post('/login', AC.adminLogin);

module.exports = router;

