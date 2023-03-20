const express = require('express');
const Book = require('../models/Book.model');
const router = express.Router();

// GET /books
router.get("/books", (req, res, next) => {
  
  Book.find()
    .then( booksArr => {

      const data = {
        books: booksArr
      };

      res.render("books/books-list", data);
    })
    .catch( e => {
      console.log("error getting books from DB", e);
      next(e);
    });

 

});

module.exports = router;
