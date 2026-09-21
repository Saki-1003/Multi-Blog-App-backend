const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  // リクエストヘッダーからトークンを取得
  // const token = req.headers.authorization?.split(" ")[1];

  // cookieからtokenを取得
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No authorization issued." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "No authorization issued." });
  }
}

module.exports = isAuthenticated;
