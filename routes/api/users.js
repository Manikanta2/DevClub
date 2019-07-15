const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

// @route     POST api/users
// @desc      Register User
// @access    Public
router.post(
    '/',
    [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Please enter a password with length greater than 6').isLength({min: 6}),
      check('email', 'Please include a valid email').isEmail()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
      }

      const {name, email, password} = req.body;

      try{
        // see if the user exists
        let user = await User.findOne({email});
        if(user){
          res.status(400).json({errors: [{msg: 'User already exists'}] });
        }
        // Get users gravatar

        const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });
        user = new User({
          name,
          email,
          avatar,
          password
        });
        // Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        // Return JsonWebToken
        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
              if(err) throw err;
              res.json({token});
            }
            );
        //res.send('User Registered');
      } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
});

module.exports = router;
