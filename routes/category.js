var express = require('express');
var router = express.Router();
var CC = require('../controller/categoryController')
const { verifyToken } = require('../middleware/authMiddleware');

/* GET users listing. */
router.get('/', CC.viewCategory);
router.post('/createCategory',verifyToken, CC.createCategory);
router.delete('/deleteCategory/:id',verifyToken, CC.deleteCategory);
router.patch('/updateCategory/:id',verifyToken, CC.updateCategory);

module.exports = router;
