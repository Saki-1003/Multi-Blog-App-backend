const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ログイン認証
const verifyLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "ユーザー情報が見つかりません" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res
      .status(401)
      .json({ error: "メールアドレスもしくはパスワードが間違っています" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7日
  });

  return res.json({ message: "ログイン成功" });
};

// Logout
const removeCredentials = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.json({ message: "ログアウトしました" });
};

module.exports = {
  verifyLogin,
  removeCredentials,
};
