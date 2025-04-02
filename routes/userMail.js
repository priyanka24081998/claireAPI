var express = require('express');
var router = express.Router();
const UMC = require('../controller/usermailController');

/* GET users listing. */
router.post('/', UMC.signup);


module.exports = router;
