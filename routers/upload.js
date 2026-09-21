// routers/upload.js
const router = require("express").Router();
const multer = require("multer");
const { uploadFile } = require("../controllers/uploadController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
