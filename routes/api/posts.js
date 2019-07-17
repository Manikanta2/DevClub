const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route     POST api/posts
// @desc      Add posts by the user
// @access    Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// @route     GET api/posts
// @desc      Get posts
// @access    Private
router.get('/', auth, async (req, res) => {
   try{
       const posts = await Post.find().sort({date: -1});
       return res.json(posts);
   } catch(err){
       console.error(err.message);
       res.status(500).send('Server Error');
   }
});


// @route     GET api/posts/:post_id
// @desc      Get post by Id
// @access    Private
router.get('/:post_id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.post_id);
        if(!post){
            return res.status(404).send('Post not found');
        }
        return res.json(post);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route     DELETE api/posts/:post_id
// @desc      Delete posts by it's Id
// @access    Private
router.delete('/post/:post_id', auth, async (req, res) => {
   try{
       const post = await Post.findById(req.params.post_id);

       // Check User
       if(post.user.toString() !== req.user.id){
           return res.status(401).json({msg: 'User not authorized'});
       }

       await post.remove();

       return res.send('Post removed');
   } catch(err){
       console.error(err.message);
       res.status(500).send('Server Error');
   }
});

module.exports = router;