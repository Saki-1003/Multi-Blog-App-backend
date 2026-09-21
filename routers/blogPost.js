const router = require("express").Router();
const multer = require("multer");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  createBlogPost,
  getAllPosts,
  getBlogArticle,
} = require("../controllers/blogPostController");

// multerの設定（メモリストレージを使用）
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/post_blog_article",
  isAuthenticated,
  upload.fields([
    { name: "images", maxCount: 3 },
    { name: "ogImage", maxCount: 1 },
  ]),
  createBlogPost,
);

router.get("/:slug", getBlogArticle);

router.get("/get_blog_articles", getAllPosts);

module.exports = router;
