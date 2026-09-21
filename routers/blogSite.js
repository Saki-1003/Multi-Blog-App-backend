const router = require("express").Router();
const multer = require("multer");
const isAuthenticated = require("../middlewares/isAuthenticated");

const {
  createBlogSite,
  getMyBlogSites,
  getBlogSiteBySlug,
  updateBlogSite,
  checkOwner,
} = require("../controllers/blogSiteController");

// multerの設定（メモリストレージを使用）
const upload = multer({ storage: multer.memoryStorage() });

// ログインユーザーのブログ一覧取得
router.get("/my_blogsites", isAuthenticated, getMyBlogSites);

// ブログサイト作成
router.post(
  "/create_blogsite",
  isAuthenticated,
  upload.fields([
    { name: "heroImg", maxCount: 1 },
    { name: "aboutImg", maxCount: 1 },
  ]),
  createBlogSite,
);

// ブログサイト更新
router.put(
  "/update_blogsite/:slug",
  isAuthenticated,
  upload.fields([
    { name: "heroImg", maxCount: 1 },
    { name: "aboutImg", maxCount: 1 },
  ]),
  updateBlogSite,
);

// ブログサイト削除
// router.delete("/delete_blogsite/:slug", isAuthenticated, deleteBlogSite);

// ブログサイトのオーナー判定
router.get("/:slug/owner", isAuthenticated, checkOwner);

// slugでブログサイト取得（公開ページ）
router.get("/:slug", getBlogSiteBySlug);

module.exports = router;
