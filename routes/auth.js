const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/auth/profile',
    failureRedirect : '/auth/signupFailed'
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/auth/profile',
    failureRedirect : '/auth/loginFailed'
}));

router.get('/signupFailed', (req, res) => {
    res.send("Signup Failed")
})

router.get('/loginFailed', (req, res) => {
    res.send("Login Failed")
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.status(200).json({
        'message': 'User Logged Out.'
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'Access Denied.'
    });
}