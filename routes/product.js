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
  upload.array("images", 5), async (req, res) => {
    try {
      const imageUrls = req.files.map((file) => file.path); // Cloudinary URLs
  
      const product = new Product({
        ...req.body,
        images: imageUrls, // Save Cloudinary URLs
      });
  
      await product.save();
  
      res.status(201).json({ message: "Product created", product });
    } catch (error) {
      console.error("Error uploading images:", error);
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
