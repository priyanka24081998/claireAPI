var express = require('express');
var router = express.Router();
const UMC = require('../controller/usermailController');

/* GET users listing. */
router.post('/', UMC.signup);
router.get('/getuser/:id',UMC.getusermail);
router.get('/users',UMC.viewalluser);
router.delete('/deleteusermail/:id',UMC.deleteUsermail);

module.exports = router;
