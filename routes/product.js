var express = require("express");
var router = express.Router();
const PC = require("../controller/productController");
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");

// Use memoryStorage instead of diskStorage (better for Cloudinary)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

/* GET all products */
router.get("/", PC.viewProducts);
router.get("/:id",PC.viewProductsbyID)
/* CREATE a new product (Protected Route) */
router.post(
  "/createProduct",
  verifyToken, // Verify user first
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 }
  ]),
  PC.createProduct
);


// router.post(
//   "/createProduct",
//   verifyToken, // Verify user first
//   upload.single('images'),
//   PC.createProduct
// );
/* DELETE a product by ID (Protected Route) */
router.delete("/deleteProduct/:id", verifyToken, PC.deleteProduct);

/* UPDATE a product by ID (Protected Route) */
router.patch(
  "/updateProduct/:id",
  verifyToken, // Verify user first
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 }
  ]),
  PC.updateProduct
);

module.exports = router;
