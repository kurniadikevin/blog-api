var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config()
var logger = require('morgan');
var cors = require('cors');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user');
const bcrypt =require('bcryptjs');
const Parse = require('parse');
const compression= require('compression');
const helmet = require("helmet");
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentRouter = require('./routes/comment');
require('dotenv').config();


var app = express();
app.use(cors({

  origin : ['https://cmsblackboardjournal.vercel.app','https://blackboardjournal.vercel.app', process.env.LOCAL_CLIENTHOST],
  credentials : true,
  
}));

/* app.use(compression());
app.use(helmet()); */
//make static file for images uploads
app.use(express.static('image-uploads'))

//set up mongodb connection with mongoose
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI 
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//make static file for images uploads
app.use(express.static('image-uploads'))

//passport local strategy method
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        }
         else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//user authentication and sign up
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/posts/', commentRouter);


app.post(
  "/users/log-in",
  passport.authenticate("local", {
    //successRedirect: "https://cmsblackboardjournal.vercel.app/",
    //failureRedirect: "https://cmsblackboardjournal.vercel.app/",
    passReqToCallback: true
  }), (req, res)=>{
    // If you use "Content-Type": "application/json"
    // req.isAuthenticated is true if authentication was success else it is false
    res.json({auth: req.isAuthenticated()});
});


app.get('/currentUser', function(req, res) {
   //res.send(req.user)
   Parse.User.enableUnsafeCurrentUser()
  
   User.find({_id: req.user._id}, "")
   
   .exec(function (err, list_user) {
     if (err) {
       return next(err);
     }
     //Successful, so render
     res.json(list_user);
     console.log(list_user);
   });
    
  });
  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
