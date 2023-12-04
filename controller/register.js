const bcrypt = require("bcrypt");
const pool = require("../config/dbConncection");

const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const existingUser = await pool.query(
      "SELECT username from users WHERE username=$1",
      [req.body.username]
    );

    if (existingUser.rowCount === 0) {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      await pool.query(
        "INSERT INTO users(username, passhash,refreshToken) values($1,$2,$3) RETURNING id, username",
        [req.body.username, hashedPass, null]
      );

      res.json({
        loggedIn: true,
        username: req.body.username,
        message: "User registered successfully",
      });
    } else {
      res.json({ loggedIn: false, message: "Username taken" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ loggedIn: false, message: "Internal Server Error" });
  }
};

module.exports = registerUser;
