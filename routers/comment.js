const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  createComment,
  getComments,
  getAllCommentsByUser,
} = require("../controllers/commentController");

// コメント投稿
router.post("/comment", isAuthenticated, createComment);

//　ユーザーごとのコメント取得
router.get("/get-all-comments-by-user", isAuthenticated, getAllCommentsByUser);

// ブログごとのコメント取得
router.get("/:postId", getComments);

module.exports = router;
