const prisma = require("../lib/prisma");

const getFavoriteSites = async (req, res) => {
  try {
    const userId = req.user.id; // middlewareでcookieにセットしたものを受け取る
    const favoriteSites = await prisma.favoriteSite.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        site: {
          include: {
            owner: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(favoriteSites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getFavoriteAuthors = async (req, res) => {
  try {
    const userId = req.user.id; // middlewareでcookieにセットしたものを受け取る
    const favoriteAuthors = await prisma.favoriteAuthor.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(favoriteAuthors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const saveFavoriteSite = async (req, res) => {
  try {
    const userId = req.user.id; // middlewareでcookieにセットしたものを受け取る
    const { targetId } = req.body;

    const siteOwner = await prisma.blogSite.findUnique({
      where: {
        id: targetId,
      },
    });

    if (Number(userId) === Number(siteOwner.ownerId)) return; // 自分で自分のサイトをお気に入り登録できないようにする

    const newFavSite = await prisma.favoriteSite.create({
      data: {
        userId: Number(userId),
        siteId: Number(targetId),
      },
    });

    return res.status(200).json(newFavSite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const saveFavoriteAuthor = async (req, res) => {
  try {
    const userId = req.user.id; // middlewareでcookieにセットしたものを受け取る
    const { targetId } = req.body;

    if (Number(userId) === Number(targetId)) return; // 自分で自分をお気に入り登録できないようにする

    const newFavAuthor = await prisma.favoriteAuthor.create({
      data: {
        userId: Number(userId),
        authorId: Number(targetId),
      },
    });

    return res.status(200).json(newFavAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteFavoriteSite = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await prisma.favoriteSite.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteFavoriteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await prisma.favoriteAuthor.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getFavoriteSites,
  getFavoriteAuthors,
  saveFavoriteSite,
  saveFavoriteAuthor,
  deleteFavoriteSite,
  deleteFavoriteAuthor,
};
