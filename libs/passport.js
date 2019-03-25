/* MTI CONFIDENTIAL INFORMATION */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var model = require('../models/user');

// passport config
passport.use(new LocalStrategy(function(username, password, done) {
   new model.User({username: username}).fetch().then(function(data) {
      var user = data;
      if(user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Invalid username or password'});
         } else {
            return done(null, user);
         }
      }
   });
}));

// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    new model.User({username: username}).fetch().then(function(user) {
        done(null, user);
    });
});

module.exports = passport;
