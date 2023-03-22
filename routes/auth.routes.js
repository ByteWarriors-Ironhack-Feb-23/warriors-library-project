const express = require('express');
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
      next(error)
    });

});


//GET user-profile
router.get('/user-profile', (req, res) => res.render('auth/user-profile'));


module.exports = router;
