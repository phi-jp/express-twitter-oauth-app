/*
 *
 */

var express = require('express');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var path = require('path');
var app = express();
var config = process.env.TWITTER_CONSUMER_KEY ? process.env : require('./config.js');

var TWITTER_CONSUMER_KEY = config.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = config.TWITTER_CONSUMER_SECRET;
var SECRET = config.SECRET

// passport
passport.use(new Strategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1:3000/login/twitter/return'
}, function(token, tokenSecret, profile, done) {
  return done(null, profile);
}));
passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Config
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: SECRET, resave: true, saveUninitialized: true }));

// Init Passport and Session
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/', function(req, res) {
  res.render('home', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/login/twitter/return',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/profile', function(req, res){
  res.render('profile', { user: req.user });
});

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
