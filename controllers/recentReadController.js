const prisma = require("../lib/prisma");

const saveRecentRead = async (req, res) => {
  try {
    const userId = req.user.id; // middlewareでcookieにセットしたものを受け取る
    const { postId } = req.body;

    const toUpdate = await prisma.recentRead.findUnique({
      where: {
        userId_postId: {
          userId: Number(userId),
          postId: Number(postId),
        },
      },
    });

    if (toUpdate) {
      const updatedRecentRead = await prisma.recentRead.update({
        where: {
          userId_postId: {
            userId: Number(userId),
            postId: Number(postId),
          },
        },
        data: {
          createdAt: new Date(),
        },
      });
      return res.status(200).json(updatedRecentRead);
    } else {
      const recentRead = await prisma.recentRead.create({
        data: {
          userId: Number(userId),
          postId: Number(postId),
        },
      });

      return res.status(200).json(recentRead);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getRecentReads = async (req, res) => {
  try {
    const userId = req.user.id; // middlewareでcookieにセットしたものを受け取る

    const recentReads = await prisma.recentRead.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        post: {
          include: {
            blogSite: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(recentReads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  saveRecentRead,
  getRecentReads,
};
