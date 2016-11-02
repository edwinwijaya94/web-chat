var express = require('express');
var router = express.Router();

router.use('/user', require('./user'));
router.use('/group', require('./group'));
router.use('/chat', require('./chat'));

module.exports = router;