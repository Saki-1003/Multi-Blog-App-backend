const prisma = require("../lib/prisma");
const { uploadToR2, deleteFromR2 } = require("../utils/r2");

// BlogSiteのオーナー判定
const checkOwner = async (req, res) => {
  try {
    const { slug } = req.params;

    // slugからblogSiteを取得
    const blogSite = await prisma.blogSite.findUnique({
      where: { slug },
    });

    if (!blogSite) {
      return res.status(404).json({ error: "BlogSite not found" });
    }

    // ログインユーザーがオーナーかどうか判定
    const isOwner = blogSite.ownerId === req.user.id;

    return res.json({ isOwner });
  } catch (error) {
    console.error("Owner check error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// BlogSite作成
const createBlogSite = async (req, res) => {
  const { title, slug, description, about, themeColor } = req.body;

  let heroImgUrl = null;
  let aboutImgUrl = null;

  try {
    // R2に画像アップロード
    if (req.files?.heroImg) {
      heroImgUrl = await uploadToR2(req.files.heroImg[0]);
    }
    if (req.files?.aboutImg) {
      aboutImgUrl = await uploadToR2(req.files.aboutImg[0]);
    }

    // DB保存
    const blogSite = await prisma.blogSite.create({
      data: {
        title,
        slug,
        description,
        about,
        themeColor,
        heroImg: heroImgUrl,
        aboutImg: aboutImgUrl,
        ownerId: req.userId, //middlewareで設定したものを取得
      },
    });

    return res.json({ blogSite });
  } catch (error) {
    console.error("createBlogSite error:", error);
    // ロールバック（R2から画像を削除）
    if (heroImgUrl) {
      await deleteFromR2(heroImgUrl);
    }
    if (aboutImgUrl) {
      await deleteFromR2(aboutImgUrl);
    }
    // Prismaのunique constraint error（slug重複）
    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return res.status(409).json({
        error: "このURLは既に使用されています。別の文字列を入力してください。",
      });
    }
    return res
      .status(500)
      .json({ error: "ブログサイトを作成できませんでした" });
  }
};

const updateBlogSite = async (req, res) => {
  const { slug } = req.params;

  try {
    const blogSite = await prisma.blogSite.findUnique({
      where: { slug },
    });

    if (!blogSite) {
      return res.status(404).json({ error: "BlogSite not found" });
    }

    // owner判定
    if (blogSite.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const data = {
      title: req.body.title,
      description: req.body.description,
      about: req.body.about,
      themeColor: req.body.themeColor,
    };

    // Heroが新しくアップロードされたら画像差し替え
    if (req.files?.heroImg) {
      if (blogSite.heroImg) {
        await deleteFromR2(blogSite.heroImg);
      }
      data.heroImg = await uploadToR2(req.files.heroImg[0]);
    }

    // About画像差し替え
    if (req.files?.aboutImg) {
      if (blogSite.aboutImg) {
        await deleteFromR2(blogSite.aboutImg);
      }
      data.aboutImg = await uploadToR2(req.files.aboutImg[0]);
    }

    const updated = await prisma.blogSite.update({
      where: { slug },
      data,
    });

    return res.json({ blogSite: updated });
  } catch (error) {
    console.error("updateBlogSite error:", error);
    return res.status(500).json({ error: "Failed to update blog site" });
  }
};

// ログインユーザーのブログ一覧
const getMyBlogSites = async (req, res) => {
  try {
    const blogSites = await prisma.blogSite.findMany({
      where: { ownerId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(blogSites);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "ブログサイトを取得できませんでした" });
  }
};

// slug でブログサイト取得（公開ページ）
const getBlogSiteBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const blogSite = await prisma.blogSite.findUnique({
      where: { slug },
      include: {
        posts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!blogSite) {
      return res.status(404).json({ error: "Blog site not found." });
    }

    return res.json({ blogSite });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch blog site." });
  }
};

// 削除（オーナーのみ）
// const deleteBlogSite = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const blogSite = await prisma.blogSite.findUnique({
//       where: { id: Number(id) },
//     });

//     if (!blogSite || blogSite.ownerId !== req.userId) {
//       return res.status(403).json({ error: "Not authorized." });
//     }

//     await prisma.blogSite.delete({
//       where: { id: Number(id) },
//     });

//     return res.json({ message: "Blog site deleted." });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to delete blog site." });
//   }
// };

module.exports = {
  createBlogSite,
  getMyBlogSites,
  getBlogSiteBySlug,
  updateBlogSite,
  checkOwner,
};
