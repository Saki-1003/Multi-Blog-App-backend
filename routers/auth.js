const router = require("express").Router();
const {
  verifyLogin,
  removeCredentials,
} = require("../controllers/authController");

//login verification
router.post("/login", verifyLogin);

// logout
router.post("/logout", removeCredentials);

module.exports = router;
