const pool = require("../config/dbConncection");

const Logout = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(400).json({ message: "No JWT cookie found" });
    }

    const refreshToken = cookies.jwt;

    const foundUser = await pool.query(
      "SELECT username, id FROM users WHERE refreshToken=$1",
      [refreshToken]
    );

    console.log(foundUser.rows[0]);

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res
        .status(404)
        .json({ message: "Refresh token not found in the database" });
    }

    // Delete refreshToken in the database
    await pool.query("UPDATE users SET refreshToken=$1 WHERE id=$2", [
      null,
      foundUser.rows[0].id,
    ]);

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    return res
      .status(200)
      .json({ message: "Successfully logged out", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = Logout;
