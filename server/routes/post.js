const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");


router.get('/allposts',requireLogin,(req,res) => {
    // find all posts
    Post.find()
    .populate('postedBy','_id name')
    .populate('comments.commentBy','_id name')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err);
    })
})

router.post('/createpost',requireLogin,(req,res) => {
    const {title,body,pic} = req.body;
    console.log(req.body)
    if(!title || !body || !pic) {
        return res.status(422).json({error: "Please add all the fields"});
    }
    // password는 저장하지 않는다
    req.userinfo.password = undefined;
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy: req.userinfo
    })
    post.save() // mongodb에 저장
    .populate('postedBy','_id name')
    .populate('comments.commentBy','_id name')
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
    .populate('comments.commentBy','_id name')
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err => {
        console.log(err);
    })
})

router.put('/like', requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes: req.userinfo._id}
    }, 
    {
        new: true
    })
    .populate('postedBy','_id name')
    .populate('comments.commentBy','_id name')
    .exec((err,result) => {
        if(err) {
            return res.status(422).json({error: err})
        }
        else {
            console.log(`result`+result);
            return res.json(result);
        }
    })
})

router.put('/unlike', requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes: req.userinfo._id}
    }, {
        new: true
    })
    .populate('postedBy','_id name')
    .populate('comments.commentBy','_id name')
    .exec((err,result) => {
        if(err) {
            console.log(err);
            return res.status(422).json({error: err})
        }
        else {
            console.log(result)
            return res.json(result);
        }
    })
})

router.put('/comment', requireLogin, (req,res) => {
    const comment = {
        text: req.body.text,
        commentBy: req.userinfo._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments: comment}
    }, 
    {
        new: true
    })
    .populate('postedBy','_id name')
    .populate('comments.commentBy','_id name')
    .exec((err,result) => {
        if(err) {
            return res.status(422).json({error: err})
        }
        else {
            return res.json(result);
        }
    })
})


module.exports = router;