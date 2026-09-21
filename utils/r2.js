const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// R2クライアントの初期化
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

// 画像アップロード関数
async function uploadToR2(file) {
  const fileName = `${Date.now()}-${file.originalname}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  // 公開URLを返す
  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
}

// 画像削除する関数（ロールバック用）
async function deleteFromR2(url) {
  const fileName = url.split("/").pop();

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    }),
  );
}

module.exports = { uploadToR2, deleteFromR2 };
