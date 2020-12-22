const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model("User");
const {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} = require('./keys');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log(`user`+user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log(user);
            done(err, user);
        });
    });
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        User.findOne({email:profile.emails[0].value})
        .then((savedUser) => {
            // 이미 해당 이메일의 user가 있다면
            if(savedUser) {
                done(null,savedUser);
            }
            else {
                const googleUser = new User({
                    name: profile.displayName,
                    password: profile.id,
                    email: profile.emails[0].value,
                    pic: profile.photos[0].value,
                });
                googleUser.save()
                .then((user) => {
                    done(null,user);
                })
                .catch(err => {
                    console.log(err);
                })
            }
        })
    }));
}