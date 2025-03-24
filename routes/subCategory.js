var express = require('express');
var router = express.Router();

var SC = require('../controller/subCategoryController')

/* GET users listing. */
router.get('/', SC.viewSubCategory);
router.post('/createSubCategory', SC.createSubCategory);
router.delete('/deleteSubCategory/:id', SC.deleteSubCategory);
router.patch('/updateSubCategory/:id', SC.updateSubCategory);

module.exports = router;
