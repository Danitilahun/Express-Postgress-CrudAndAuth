const pool = require("../config/dbConncection");

const getAllBooks = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM books");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a book
const createBook = async (req, res) => {
  const { title, author, description, category, rating, price } = req.body;
  console.log("req.body", req.body);
  try {
    const rows = await pool.query(
      "INSERT INTO books (title, author, description, category, rating, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, author, description, category, rating, price]
    );
    console.log("rows", rows);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query("DELETE FROM books WHERE id = $1", [
      id,
    ]);
    if (rowCount === 0) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.json({ message: "Book deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a book by ID
const updateBook = async (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body; // Fields to update from the request body
  const fieldNames = Object.keys(fieldsToUpdate);
  const fieldValues = Object.values(fieldsToUpdate);

  try {
    if (fieldNames.length === 0) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    // Constructing the SET part of the SQL query dynamically
    const setFields = fieldNames
      .map((fieldName, index) => `${fieldName} = $${index + 1}`)
      .join(", ");

    const updateQuery = {
      text: `UPDATE books SET ${setFields} WHERE id = $${
        fieldValues.length + 1
      }`,
      values: [...fieldValues, id],
    };

    const { rowCount } = await pool.query(updateQuery);

    if (rowCount === 0) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.json({ message: "Book updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
  updateBook,
};
