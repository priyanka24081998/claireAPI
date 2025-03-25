var express = require('express');
var router = express.Router();

var SC = require('../controller/subCategoryController');
const { verifyToken } = require('../middleware/authMiddleware'); 


/* GET users listing. */
router.get('/', SC.viewSubCategory);
router.post('/createSubCategory',verifyToken, SC.createSubCategory);
router.delete('/deleteSubCategory/:id',verifyToken, SC.deleteSubCategory);
router.patch('/updateSubCategory/:id',verifyToken, SC.updateSubCategory);

module.exports = router;
