const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');
module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    // req.header.authorization은 'Bearer' 라는 문자열이 포함되어 있기 때문에 이를 제거해주어야한다
    //authorization === Bearer astastasasfafs(token)
    if(!authorization) {
        return res.status(401).json({error: "you must be logged in"})
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET,(err,payload) => {
        if(err) {
            return res.status(401).json({error:"you must be logged in"})
        }
        console.log("payload",payload) // payload { _id: '5fc8dbc70511ea0490a5d5c0', exp: 1607007439, iat: 1607006839 }
        const {_id} = payload;
        User.findById(_id)
        .then(userData => {
            req.userinfo = userData;
            next();
        })
        // next();
        // 만약 이곳에 next()를 선언한다면 userData가 전해지는데 시간이 걸리기 때문에 미리 next()가 실행되고,
        // req.userinfo는 undefined인 상태로 전해지게 될 것이다
    })
}