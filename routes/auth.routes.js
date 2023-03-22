const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;


//GET /signup
router.get("/signup", (req, res, next) => {
  res.render("auth/register.hbs");
});



//POST /signup
router.post("/signup", (req, res, next) => {

  const {email, password} = req.body;


  //validation: required fields
  if (email === "" || password === "") {
    res.status(400).render('auth/register', { errorMessage: 'All fields are mandatory. Please provide your email and password.' });
    return;
  }


  //validation: pw strength
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render('auth/register', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }


  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hash => {
      return User.create({ email, passwordHash: hash });
    })
    .then( userFromDB  => {
      //account create succcessfully
      res.redirect("/login");
    })
    .catch(error => {
      console.log("error creating account...", error);
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render('auth/register', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(400).render('auth/register', { errorMessage: "Validation error. Email needs to be unique" });
      } else {
        next(error);
      }
    });

});



//GET /login
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});



//POST /login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.status(400).render('auth/login', { errorMessage: 'Please enter both, email and password to login.' });
    return;
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        //user doesn't exist
        res.status(400).render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //login successful
        req.session.currentUser = user;
        res.render('auth/user-profile', { user: user });
      } else {
        //login failed
        res.status(400).render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => {
      console.log("error trying to login...", error);
      next(error);
    });
});



//POST /logout
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});



//GET user-profile
router.get('/user-profile', (req, res) => {
  res.render('auth/user-profile', {user: req.session.currentUser})
});


module.exports = router;
