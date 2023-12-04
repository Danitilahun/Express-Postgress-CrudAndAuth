const express = require("express");
const router = express.Router();
const bookController = require("../controller/bookController");

console.log("bookRoutes");
// Create a new book
router.post("/", bookController.createBook);

// GET all books
router.get("/", bookController.getAllBooks);

// GET a book by ID
router.get("/:id", bookController.getBookById);

// Update a book by ID
router.put("/:id", bookController.updateBook);

// Delete a book by ID
router.delete("/:id", bookController.deleteBook);

module.exports = router;
