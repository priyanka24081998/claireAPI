var express = require('express');
var router = express.Router();
const PC = require('../controller/productController')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

/* GET users listing. */
router.get('/', PC.viewProducts);
router.post('/createProduct', PC.createProduct);
router.delete('/deleteProduct/:id', PC.deleteProduct);
router.patch(
    '/updateProduct/:id',
    upload.fields([{ name: 'images' }, { name: 'videos' }]),
    PC.updateProduct
  );

module.exports = router;
