var express = require('express');
var router = express.Router();
const PC = require('../controller/productController')
const multer = require('multer');
// const upload = multer({ dest: '/' }); 
const { verifyToken } = require('../middleware/authMiddleware');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Cloudinary folder name
    allowedFormats: ["jpg", "png", "jpeg", "webp"],
  },
});


const upload = multer({ storage });

/* GET users listing. */
router.get('/', PC.viewProducts);
router.post('/createProduct',
  upload.fields([
    { name: 'imageUrl', maxCount: 10 },
    { name: 'videos', maxCount: 3 }
  ]),
  async (req, res) => {
    try {
      res.json({ imageUrl: req.file.path }); // Cloudinary URL
    } catch (error) {
      res.status(500).json({ error: "Image upload failed" });
    }
  },
  verifyToken, PC.createProduct);
router.delete('/deleteProduct/:id',verifyToken, PC.deleteProduct);
router.patch(
    '/updateProduct/:id',
    upload.fields([{ name: 'imageUrl' }, { name: 'videos' }]),verifyToken,
    PC.updateProduct
  );

module.exports = router;
