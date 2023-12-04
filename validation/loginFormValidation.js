const Yup = require("yup");

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username required!")
    .min(6, "Username too short!")
    .max(28, "Username too long!"),

  password: Yup.string()
    .required("Password required!")
    .min(8, "Password too short! Must be at least 8 characters long")
    .max(28, "Password too long! Must be at most 28 characters long")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
    .matches(
      /^(?=.*[!@#$%^&*])/,
      "Password must contain at least one special character (!@#$%^&*)"
    ),
});

module.exports = validationSchema;
