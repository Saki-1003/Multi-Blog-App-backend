const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  saveRecentRead,
  getRecentReads,
  updateRecentReads,
} = require("../controllers/recentReadController");

// 最近見た記事登録
router.post("/save", isAuthenticated, saveRecentRead);

// 最近見た記事取得
router.get("/get-recent-reads", isAuthenticated, getRecentReads);

module.exports = router;
