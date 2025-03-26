var express = require('express');
var router = express.Router();
const PC = require('../controller/productController')
const multer = require('multer');
const upload = multer({ dest: '/public/images/' }); 
const { verifyToken } = require('../middleware/authMiddleware'); 


/* GET users listing. */
router.get('/', PC.viewProducts);
router.post('/createProduct',verifyToken, PC.createProduct);
router.delete('/deleteProduct/:id',verifyToken, PC.deleteProduct);
router.patch(
    '/updateProduct/:id',
    upload.fields([{ name: 'images' }, { name: 'videos' }]),verifyToken,
    PC.updateProduct
  );

module.exports = router;
