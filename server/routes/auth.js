const express = require('express');
const router = express.Router();

// saving or posting on mongodb
const mongoose = require('mongoose');
const User = mongoose.model("User");

// bcrypt
const bcrypt = require('bcryptjs');

router.post('/signup', (req,res) => {
    const {name,email,password} = req.body;
    console.log(email);
    if(!email || !password || !name) {
        return res.status(422).json({error: "please add all the fields"});
    }
    User.findOne({email:req.body.email}) // email 항목에 동일한 "email"이 있는지 찾아줌
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json({error: "user already exists with that email"});
        }
        bcrypt.hash(password,12)
        .then(hashedpassword => {
            const user = new User({
                name,
                email,
                password: hashedpassword
            });

            user.save() // 저장
            .then((user) => {
                res.json({message: `saved successfully ${user}`})
            })
            .catch(err => {
                console.log(err);
            })
        })
    })
    .catch((err) => console.log(err));
})

module.exports = router;