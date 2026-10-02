const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop - Task 10 with async
public_users.get("/", async function (req, res) {
  try {
    // Simulate async operation
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
    };

    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN - Task 11 with Promises
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });
  };

  getBookByISBN(isbn)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

// Get book details based on author - Task 12 with async
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByAuthor = [];
          const bookKeys = Object.keys(books);

          bookKeys.forEach((key) => {
            if (books[key].author === author) {
              booksByAuthor.push(books[key]);
            }
          });

          if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
          } else {
            reject(new Error("No books found by this author"));
          }
        }, 1000);
      });
    };

    const booksByAuthor = await getBooksByAuthor();
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title - Task 13 with async
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByTitle = [];
          const bookKeys = Object.keys(books);

          bookKeys.forEach((key) => {
            if (books[key].title === title) {
              booksByTitle.push(books[key]);
            }
          });

          if (booksByTitle.length > 0) {
            resolve(booksByTitle);
          } else {
            reject(new Error("No books found with this title"));
          }
        }, 1000);
      });
    };

    const booksByTitle = await getBooksByTitle();
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;