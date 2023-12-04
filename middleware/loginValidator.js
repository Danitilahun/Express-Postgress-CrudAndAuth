const validationSchema = require("../validation/loginFormValidation");

const validateLoginForm = (req, res, next) => {
  const formData = req.body;
  validationSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).send({ message: err.errors });
      console.error(err.errors);
    })
    .then((valid) => {
      if (valid) {
        next();
      } else {
        res.status(422).send({ message: "form is not good" });
        console.error("form is not good");
      }
    });
};

module.exports = validateLoginForm;
