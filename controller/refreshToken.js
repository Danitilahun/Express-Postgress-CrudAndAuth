const jwt = require("jsonwebtoken");
const pool = require("../config/dbConncection");
const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).json({ message: "No JWT cookie found" });
    }
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    const foundUser = await pool.query(
      "SELECT username, refreshToken FROM users WHERE refreshToken=$1",
      [refreshToken]
    );

    if (foundUser.rowCount === 0) {
      // Detected refresh token reuse
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
          }
          await pool.query(
            "UPDATE users SET refreshToken=$1 WHERE username=$2",
            [null, decoded.username]
          );
        }
      );
      return res
        .status(403)
        .json({ message: "Refresh token not found in the database" });
    }

    // Verify the JWT and proceed
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        if (foundUser.rows[0].username !== decoded.username) {
          return res
            .status(403)
            .json({ message: "Mismatched user information" });
        }

        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser.rows[0].id,
              username: foundUser.rows[0].username,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "5m" }
        );

        const newRefreshToken = jwt.sign(
          { id: foundUser.rows[0].id, username: foundUser.rows[0].username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        await pool.query("UPDATE users SET refreshToken=$1 WHERE id=$2", [
          newRefreshToken,
          foundUser.rows[0].id,
        ]);

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          message: "Token refreshed successfully",
          accessToken: accessToken,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "An error occurred while processing the request",
    });
  }
};

module.exports = refreshToken;
