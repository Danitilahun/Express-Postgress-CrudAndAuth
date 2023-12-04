const express = require("express");
const validateLoginForm = require("../middleware/loginValidator");
const validateSignUpForm = require("../middleware/signUpValidator");
const Login = require("../controller/login");
const Logout = require("../controller/logOut");
const registerUser = require("../controller/register");
const refreshToken = require("../controller/refreshToken");
const loginLimiter = require("../middleware/loginRateLimiter");
const router = express.Router();

router.post("/login", loginLimiter, validateLoginForm, Login);
router.post("/signup", validateSignUpForm, registerUser);
router.post("/logout", Logout);
router.post("/refresh", refreshToken);

module.exports = router;
