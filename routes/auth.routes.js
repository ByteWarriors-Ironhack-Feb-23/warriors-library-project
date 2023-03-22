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
    res.render('auth/register', { errorMessage: 'All fields are mandatory. Please provide your email and password.' });
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
      res.redirect("/user-profile");
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


//GET user-profile
router.get('/user-profile', (req, res) => res.render('auth/user-profile'));


module.exports = router;
