const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// R2 クライアントの初期化
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// R2 にファイルをアップロードするコントローラー
const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ファイル名をユニークにする
    const fileName = `${Date.now()}-${file.originalname}`;

    // R2 にアップロード
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // 公開URLを生成
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    return res.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

module.exports = { uploadFile };
