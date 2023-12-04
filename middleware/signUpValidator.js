const validationSchema = require("../validation/signUpFormValidation");

const validateSignUpForm = async (req, res, next) => {
  const formData = req.body;
  console.log("formData", formData);

  try {
    const valid = await validationSchema.validate(formData);
    console.log("valid", valid);

    if (valid) {
      next();
    } else {
      res.status(422).send({ message: "form is not good" });
      console.log("form is not good");
    }
  } catch (err) {
    console.log("here", err.errors);
    return res.status(422).send({ message: err.errors });
  }
};

module.exports = validateSignUpForm;
