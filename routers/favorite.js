const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  getFavoriteSites,
  getFavoriteAuthors,
  saveFavoriteSite,
  saveFavoriteAuthor,
  deleteFavoriteSite,
  deleteFavoriteAuthor,
} = require("../controllers/favoriteController");

// お気に入り情報取得
router.get("/sites", isAuthenticated, getFavoriteSites);
router.get("/authors", isAuthenticated, getFavoriteAuthors);

// お気に入り登録
router.post("/save/site", isAuthenticated, saveFavoriteSite);
router.post("/save/author", isAuthenticated, saveFavoriteAuthor);

// お気に入り削除
router.delete("/delete-favorite-site/:id", isAuthenticated, deleteFavoriteSite);
router.delete(
  "/delete-favorite-author/:id",
  isAuthenticated,
  deleteFavoriteAuthor,
);

module.exports = router;
