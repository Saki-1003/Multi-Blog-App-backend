const prisma = require("../lib/prisma");
const { uploadToR2, deleteFromR2 } = require("../utils/r2");

// ブログ記事が投稿されたらDBに保存
const createBlogPost = async (req, res) => {
  const {
    title,
    slug,
    category,
    summary,
    content,
    tags,
    published,
    blogsiteSlug,
  } = req.body;

  let uploadedImages = [];
  let uploadedOgImage = null;

  try {
    const blogSite = await prisma.blogSite.findUnique({
      where: { slug: blogsiteSlug },
    });

    if (!blogSite) {
      return res.status(404).json({ error: "ブログサイトが見つかりません" });
    }

    // R2に画像アップロード
    if (req.files?.images) {
      for (const file of req.files.images) {
        const url = await uploadToR2(file);
        uploadedImages.push(url);
      }
    }

    if (req.files?.ogImage) {
      uploadedOgImage = await uploadToR2(req.files.ogImage[0]);
    }

    // DB保存
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        category,
        summary,
        content,
        images: uploadedImages,
        ogImage: uploadedOgImage,
        tags: JSON.parse(tags),
        published: published === "true",
        blogSiteId: blogSite.id,
      },
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("createBlogPost error:", error);

    // ロールバック（R2から画像を削除）
    for (const url of uploadedImages) {
      await deleteFromR2(url);
    }
    if (uploadedOgImage) {
      await deleteFromR2(uploadedOgImage);
    }

    // Prismaのunique constraint error（slug重複）
    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return res.status(409).json({
        error: "このURLは既に使用されています。別の文字列を入力してください。",
      });
    }
    return res.status(500).json({ error: "ブログ記事を作成できませんでした" });
  }
};

const getBlogArticle = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await prisma.blogPost.findUnique({
      where: { slug: slug },
      include: {
        blogSite: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!article)
      return res.status(404).json({ error: "記事が見つかりません" });
    return res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const articles = await prisma.blogPost.findMany();
    return res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createBlogPost,
  getAllPosts,
  getBlogArticle,
};
