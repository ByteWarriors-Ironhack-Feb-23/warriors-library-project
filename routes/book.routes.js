const express = require('express');
const Book = require('../models/Book.model');
const Author = require('../models/Author.model');

const isUserLoggedIn = require("../middleware/isLoggedIn");

const router = express.Router();




//READ: list of books
router.get("/books", (req, res, next) => {
  Book.find()
    .populate("author")
    .then(booksArr => {

      const data = {
        books: booksArr
      };

      res.render("books/books-list", data);
    })
    .catch(e => {
      console.log("error getting books from DB", e);
      next(e);
    });
});



//CREATE: display form
router.get("/books/create", isUserLoggedIn, (req, res, next) => {

  Author.find()
    .then( authorsArr => {
      
      const data = {
        authors: authorsArr
      }

      res.render("books/book-create", data);
    })
    .catch(e => {
      console.log("error getting authors....", e);
      next(e);
    });

  
});



//CREATE: process form
router.post("/books", isUserLoggedIn, (req, res, next) => {

  const bookDetails = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    rating: req.body.rating
  }

  Book.create(bookDetails)
    .then(bookFromDB => {
      res.redirect("/books");
    })
    .catch(e => {
      console.log("error creating new book", e);
      next(e);
    });

});



//READ: book details
router.get("/books/:bookId", (req, res, next) => {

  const { bookId } = req.params;

  Book.findById(bookId)
    .populate("author")
    .then(bookDetails => {

      console.log(bookDetails)

      res.render("books/book-details", bookDetails);
    })
    .catch(e => {
      console.log("error getting book details from DB", e);
      next(e);
    });

});



//UPDATE: display form
router.get('/books/:bookId/edit', isUserLoggedIn, (req, res, next) => {
  const { bookId } = req.params;

  let bookDetails;

  Book.findById(bookId)
    .then(bookFromDB => {
      bookDetails = bookFromDB; //update variable in the parent scope
      return Author.find(); //get list of authors
    })
    .then( authorsArr => {

      const data = { 
        book: bookDetails,
        authors: authorsArr
      }

      res.render('books/book-edit.hbs', data);
    } )
    .catch(error => next(error));
});



//UPDATE: process form
router.post('/books/:bookId/edit', isUserLoggedIn, (req, res, next) => {
  const { bookId } = req.params;
  const { title, description, author, rating } = req.body;

  Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
    .then(updatedBook => {
      res.redirect(`/books/${updatedBook.id}`); //redirect to book details page
    })
    .catch(error => next(error));
});



//DELETE
router.post('/books/:bookId/delete', isUserLoggedIn, (req, res, next) => {
  const { bookId } = req.params;

  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect('/books'))
    .catch(error => next(error));
});



module.exports = router;
