const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const authRoute = require("./routers/auth");
const blogPostRoute = require("./routers/blogPost");
const blogSiteRoute = require("./routers/blogSite");
const commentsRoute = require("./routers/comment");
const userRoute = require("./routers/user");
const favoriteRoute = require("./routers/favorite");
const recentReadsRoute = require("./routers/recentRead");
const uploadRoute = require("./routers/upload");

const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/blogsites", blogSiteRoute);
app.use("/api/posts", blogPostRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/users", userRoute);
app.use("/api/favorite", favoriteRoute);
app.use("/api/recent-read", recentReadsRoute);
app.use("/api", uploadRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
