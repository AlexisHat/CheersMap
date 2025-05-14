const AWS = require("aws-sdk");
const locationApiCache = require("./cache");
const Location = require("../models/Location");
const Post = require("../models/Post");

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

exports.createPost = async (
  locationId,
  comment,
  frontImageKey,
  backImageKey
) => {
  if (!locationId || !comment || !frontImageKey || !backImageKey) {
    throw new Error("Einer oder mehrere Parameter fehlen.");
  }

  let locationDoc = await Location.findOne({ placeId: locationId });

  if (!locationDoc) {
    const cachedPlace = locationApiCache.get(locationId);

    if (!cachedPlace) {
      throw new Error(
        "Location nicht in Datenbank oder Cache gefunden. Bitte erst abrufen."
      );
    }

    locationDoc = await Location.create({
      name: cachedPlace.displayName?.text ?? "Unbenannt",
      formattedAddress: cachedPlace.formattedAddress,
      placeId: cachedPlace.id,
      googleMapsUri: cachedPlace.googleMapsUri,
      primaryType: cachedPlace.primaryType,
      coordinates: {
        lat: cachedPlace.location.latitude,
        lng: cachedPlace.location.longitude,
      },
    });
  }

  const post = await Post.create({
    location: locationDoc._id,
    comment,
    frontImageKey,
    backImageKey,
  });

  return post;
};
