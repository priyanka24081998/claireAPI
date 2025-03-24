var express = require('express');
var router = express.Router();

var CC = require('../controller/categoryController')

/* GET users listing. */
router.get('/', CC.viewCategory);
router.post('/createCategory', CC.createCategory);
router.delete('/deleteCategory/:id', CC.deleteCategory);
router.patch('/updateCategory/:id', CC.updateCategory);

module.exports = router;
