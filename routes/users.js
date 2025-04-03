var express = require('express');
var router = express.Router();
const UC = require('../controller/userController');

/* GET users listing. */
router.post('/', UC.loginUser);
router.post('/sendOtp',UC.sendOtp);
router.post('/verifyOtp',UC.verifyOtp);
router.post('/resendOtp', UC.resendOtp); 
router.post('/register',UC.registerUser);
router.get('/all',UC.getAllUsers);
router.get('/:id',UC.getUserById);
router.delete('/deleteUser/:id',UC.deleteUser);
router.patch('/updateUser/:id',UC.updatePassword);
router.post('/forgotpassword',UC.forgotPassword);
router.post('/verifyotpreset',UC.verifyOtpForReset);
router.post('/resetpassword',UC.resetPassword)



module.exports = router;
