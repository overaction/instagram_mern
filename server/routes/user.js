const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:userId',requireLogin,(req,res) => {
    User.findOne({_id: req.params.userId})
    // password 항목은 제외
    .select('-password')
    .then(user => {
        Post.find({postedBy: req.params.userId})
        .populate('postedBy', '_id name')
        .exec((err,posts) => {
            if(err) {
                return res.status(422).json({error:err});
            }
            else {
                return res.json({user,posts})
            }
        })
    }).catch(err => {
        return res.status(404).json({error: "User not found"})
    })
})

router.put('/follow', requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.userinfo._id}
    }, {
        new: true
    })
    .exec((err,otheruser) => {
        if(err) {
            console.log(err);
            return res.status(422).json({error: err})
        }
        else {
            User.findByIdAndUpdate(req.userinfo._id, {
                $push: {followings: req.body.followId}
            }, {
                new: true
            })
            .select('-password')
            .exec((err,myinfo) => {
                if(err) {
                    console.log(err);
                    return res.status(422).json({error: err})
                }
                return res.json({otheruser,myinfo})
            })
        }
    })
})

router.put('/unfollow', requireLogin, (req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers: req.userinfo._id}
    }, {
        new: true
    })
    .exec((err,result) => {
        if(err) {
            console.log(err);
            return res.status(422).json({error: err})
        }
        else {
            User.findByIdAndUpdate(req.userinfo._id, {
                $pull: {followings: req.body.unfollowId}
            }, {
                new: true
            })
            .select('-password')
            .exec((err,result2) => {
                if(err) {
                    console.log(err);
                    return res.status(422).json({error: err})
                }
                return res.json({result,result2})
            })
        }
    })
});

router.put('/updatepic',requireLogin,(req,res) => {
    User.findByIdAndUpdate({_id: req.userinfo._id}, {
        $set: {pic: req.body.pic}
    }, {
        new: true
    })
    .exec((err, result) => {
        if(err) {
            console.log(err);
            return res.status(422).json({error: err})
        }
        else {
            res.json({result});
        }
    })
});

router.post('/search-users',requireLogin,(req,res) => {
    let userPattern = new RegExp('^'+req.body.query);
    if(req.body.query !== '') {
        User.find({email:{$regex: userPattern}})
        
        .then(user => res.json({user}))
        .catch(err => console.log(err))
    }
    else res.json({})
})

module.exports = router;