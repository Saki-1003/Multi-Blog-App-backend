const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const { registerUser, findUser } = require("../controllers/userController");

// ログインユーザー情報取得
router.get("/find_user", isAuthenticated, findUser);

// 新規ユーザー登録
router.post("/register", registerUser);

module.exports = router;
