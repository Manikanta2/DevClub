var express = require('express');
var router = express.Router();

// @route     GET api/users
// @desc      Test route
// @access    Public
router.get('/', (req, res) => res.send('User Route'));

module.exports = router;
