const express = require('express');
const Author = require('../models/Author.model');

const isUserLoggedIn = require("../middleware/isLoggedIn");

const router = express.Router();



//GET /authors
router.get("/authors", isUserLoggedIn, (req, res, next) => {
  Author.find()
    .then( authorsArr => {

      const data = {
        authors: authorsArr
      }

      res.render("authors/authors-list", data);
    })
    .catch(e => {
      console.log("error getting authors from DB", e);
      next(e);
    });
});



module.exports = router;
