const express = require('express');
const router = express.Router();

// saving or posting on mongodb
const mongoose = require('mongoose');
const User = mongoose.model("User");



router.get('/', (req,res) => {
    res.send("hello");
});

router.post('/signup', (req,res) => {
    const {name,email,password} = req.body;
    console.log(email);
    if(!email || !password || !name) {
        return res.status(422).json({error: "please add all the fields"});
    }
    User.findOne({email:email}) // email 항목에 동일한 "email"이 있는지 찾아줌
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json({error: "user already exists with that email"});
        }
        else {
            const user = new User({
                name,
                email,
                password
            });

            user.save()
            .then((user) => {
                res.json({message: `saved successfully ${user}`})
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
    .catch((err) => console.log(err));
})

module.exports = router;