const express = require('express');
const router = express.Router();
const sliderController = require('../controller/slideImgController');
const multer = require('multer');
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


router.post('/add', upload.array('images', 20), sliderController.addImg);
router.get('/all', sliderController.getAllImgs);
router.put('/update/:id', upload.array('images', 10), sliderController.updateImg);
router.delete('/delete/:id', sliderController.deleteImg);

module.exports = router;
