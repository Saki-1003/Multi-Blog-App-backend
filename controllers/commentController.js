const prisma = require("../lib/prisma");

// コメント投稿
const createComment = async (req, res) => {
  const { comment, postId } = req.body;

  if (!comment) {
    return res.status(400).json({ error: "The post has no content." });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        comment,
        postId: Number(postId),
        userId: req.user.id,
      },
      include: {
        user: true,
      },
    });

    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// postIdでコメント取得
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        post: true,
      },
    });

    return res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllCommentsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // middlewareでcookieにセットしたものを受け取る
    const comments = await prisma.comment.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        post: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createComment,
  getComments,
  getAllCommentsByUser,
};
