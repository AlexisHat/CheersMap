const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.validateImage = (file) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  return allowedTypes.includes(file.mimetype) && file.size <= maxSizeInBytes;
};

exports.uploadToS3 = async (file, key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.upload(params).promise();
  return key;
};
