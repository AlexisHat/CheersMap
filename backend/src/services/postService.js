const AWS = require("aws-sdk");
const locationApiCache = require("./cache");
const Location = require("../models/Location");
const Post = require("../models/Post");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.getSignedUrl = (key, expiresInSeconds = 500) => {
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: expiresInSeconds,
  });
};

exports.createPost = async (
  locationId,
  comment,
  userId,
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
    user: userId,
    comment,
    frontImageKey,
    backImageKey,
  });

  return post;
};
