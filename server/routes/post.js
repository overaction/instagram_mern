const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");


router.get('/allposts', (req,res) => {
    // find all posts
    Post.find()
    .populate('postedBy','_id name')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err);
    })
})

router.post('/createpost',requireLogin,(req,res) => {
    const {title,body} = req.body;
    if(!title || !body) {
        return res.status(422).json({error: "Please add all the fields"});
    }
    // password는 저장하지 않는다
    req.userinfo.password = undefined;
    const post = new Post({
        title,
        body,
        postedBy: req.userinfo
    })
    post.save() // mongodb에 저장
    .then((post) => {
        res.json({post: post})
    })
    .catch(err => {
        console.log(err);
    })
})

router.get('/mypost', requireLogin, (req,res) => {
    Post.find({postedBy: req.userinfo._id})
    .populate('postedBy','_id name')
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err => {
        console.log(err);
    })
})
module.exports = router;