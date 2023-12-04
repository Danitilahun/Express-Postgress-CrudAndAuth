const bcrypt = require("bcrypt");
const pool = require("../config/dbConncection");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  try {
    const potentialLogin = await pool.query(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      [req.body.username]
    );

    if (potentialLogin.rowCount === 0) {
      res.json({
        loggedIn: false,
        status: "Wrong username or password!",
        message: "Username not found",
      });
      console.log("Username not found");
      return;
    }

    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].passhash
    );

    if (!isSamePass) {
      res.json({
        loggedIn: false,
        status: "Wrong username or password!",
        message: "Invalid password or username",
      });
      console.log("Invalid password");
      return;
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: potentialLogin.rows[0].id,
          username: potentialLogin.rows[0].username,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const newRefreshToken = jwt.sign(
      {
        id: potentialLogin.rows[0].id,
        username: potentialLogin.rows[0].username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await pool.query("UPDATE users SET refreshToken=$1 WHERE id=$2", [
      newRefreshToken,
      potentialLogin.rows[0].id,
    ]);

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      loggedIn: true,
      accessToken: accessToken,
      user: { username: req.body.username, id: potentialLogin.rows[0].id },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      loggedIn: false,
      status: "Internal Server Error",
      message: "Internal Server Error",
    });
  }
};

module.exports = Login;
