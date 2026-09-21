const generateIdenticon = require("../utils/generateIdenticon");
const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

// 新規ユーザー登録
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const hashedPW = await bcrypt.hash(password, 10);
    const defaultAvatar = generateIdenticon(username);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPW,
        avatar: defaultAvatar,
      },
    });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Registration failed." });
  }
};

// ログインユーザー情報取得
const findUser = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "No authorization issued." });
  }
  try {
    const matchingUser = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!matchingUser) {
      return res.status(404).json({ error: "The user cannot be found." });
    }

    return res.status(200).json({
      user: {
        id: matchingUser.id,
        email: matchingUser.email,
        username: matchingUser.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "No authorization issued." });
  }
};

module.exports = {
  findUser,
  registerUser,
};
