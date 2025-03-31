var express = require('express');
var router = express.Router();
const PC = require('../controller/productController')
const multer = require('multer');
const { verifyToken } = require('../middleware/authMiddleware');



const storage = multer.diskStorage({})
const upload = multer({ storage : storage });

/* GET users listing. */
router.get('/', PC.viewProducts);
router.post('/createProduct',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 }
  ]),(req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({
      message: "File uploaded successfully",
      url: req.file.path, 
    });
  },verifyToken, PC.createProduct);
router.delete('/deleteProduct/:id',verifyToken, PC.deleteProduct);
router.patch(
    '/updateProduct/:id',
    upload.fields([{ name: 'images' }, { name: 'videos' }]),verifyToken,
    PC.updateProduct
  );

module.exports = router;
