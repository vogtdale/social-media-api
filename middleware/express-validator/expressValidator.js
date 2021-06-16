const { check } = require("express-validator");

module.exports.registerValidator = [
  check("username", "Username is required")
    .not()
    .isEmpty()
    .whitelist(["abcdefghijklmnñopqrstuvwxyz", "@", "."])
    .withMessage("No script tags allowed")
    .trim()
    .escape(),
  check("email", "Provide a valide email address")
    .not()
    .isEmpty()
    .withMessage("All fields are required")
    .isEmail()
    .withMessage("Please enter a valide email address")
    .trim()
    .escape()
    .normalizeEmail(),
  check("pwd")
    .not()
    .isEmpty()
    .withMessage("All fields are required")
    .isLength({ min: 6 })
    .withMessage("Passwords needs to contain 6 letters at least")
    .trim()
    .escape(),
  check("pwdVerified")
    .not()
    .isEmpty()
    .withMessage("All fields are required")
    .isLength({ min: 6 })
    .withMessage("Passwords needs to contain 6 letters at least")
    .trim()
    .escape(),
];

module.exports.loginValidator = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("All fields are required")
    .isEmail()
    .withMessage("Please enter a valide email address")
    .trim()
    .escape()
    .normalizeEmail(),
  check("pwd")
    .not()
    .isEmpty()
    .withMessage("All fields are required")
    .isLength({ min: 6 })
    .withMessage("Passwords needs to contain 6 letters at least")
    .trim()
    .escape(),
];
