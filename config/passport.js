// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

//persistent login sessions
const localConfig = (passport) => {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //user logs in
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            if (email) {
                email = email.toLowerCase();
            }

            process.nextTick(function() {
                User.findOne({'local.email' :  email}, function(err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        return done(err);
                    } else if (!user) {
                        return done(null, false);
                    } else if (!user.validPassword(password)) {
                        return done(null, false);
                    } else {
                        return done(null, user);
                    }
                });
            });

        }));

    //user signs up
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            if (email) {
                email = email.toLowerCase();
            }

            process.nextTick(function() {
                // if the user is not already logged in:
                if (!req.user) {
                    return createUser(new User(), email, password, done);
                // check if the email used to connect a local account is being used by another user
                } else if (!req.user.local.email) {
                    return createUser(req.user, email, password, done);
                } else { // user is logged in and already has a local account. Ignore signup.
                    return done(null, req.user);
                }
            });
        }));
};

function createUser(newUser, email, password, done) {
    User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err) {
            return done(err);
        } else if (user) { //if there's already a user with this email
            return done(null, false);
        } else { //create the user
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            newUser.save(function(err) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        }
    });
}

module.exports = localConfig;