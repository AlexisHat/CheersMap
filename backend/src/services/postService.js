const locationApiCache = require("./cache");
const Location = require("../models/Location");
const Post = require("../models/Post");
const { getSignedUrl } = require("./awsService");

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

exports.getPostPreviewsFor = async (userId) => {
  const posts = await Post.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return posts.map((post) => ({
    id: post._id.toString(),
    frontCamUrl: getSignedUrl(post.frontImageKey),
    backCamUrl: getSignedUrl(post.backImageKey),
  }));
};
