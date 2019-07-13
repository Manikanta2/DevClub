var express = require('express');
var router = express.Router();

// @route     GET api/profile
// @desc      Test route
// @access    Public
router.get('/', (req, res) => res.send('Profile Route'));

module.exports = router;