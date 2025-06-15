jest.mock("../src/services/cache", () => ({
  get: jest.fn(),
}));

jest.mock("../src/models/Location", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../src/models/Post", () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../src/services/awsService", () => ({
  getSignedUrl: jest.fn(),
}));

const locationApiCache = require("../src/services/cache");
const Location = require("../src/models/Location");
const Post = require("../src/models/Post");
const { getSignedUrl } = require("../src/services/awsService");

// Jetzt das Modul unter Test nach den Mocks laden
const postService = require("../src/services/postService");

describe("postService", () => {
  const userId = "user123";
  const locationId = "place_abc";
  const comment = "Nice place";
  const frontImageKey = "front.png";
  const backImageKey = "back.png";
  const frontHash = "hashF";
  const backHash = "hashB";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("wirft einen Fehler, wenn Pflichtparameter fehlen", async () => {
      await expect(
        postService.createPost(
          null,
          comment,
          userId,
          frontImageKey,
          backImageKey,
          frontHash,
          backHash
        )
      ).rejects.toThrow("Einer oder mehrere Parameter fehlen.");
    });

    it("nutzt vorhandene Location aus der DB", async () => {
      const locationDoc = { _id: "loc1" };
      Location.findOne.mockResolvedValue(locationDoc);
      Post.create.mockResolvedValue({ id: "post1" });

      const result = await postService.createPost(
        locationId,
        comment,
        userId,
        frontImageKey,
        backImageKey,
        frontHash,
        backHash
      );

      expect(Location.findOne).toHaveBeenCalledWith({ placeId: locationId });
      expect(Location.create).not.toHaveBeenCalled();
      expect(Post.create).toHaveBeenCalledWith({
        location: locationDoc._id,
        user: userId,
        comment,
        frontImageKey,
        backImageKey,
        imageHashFront: frontHash,
        imageHashBack: backHash,
      });
      expect(result).toEqual({ id: "post1" });
    });

    it("legt Location aus dem Cache an, wenn sie nicht in der DB existiert", async () => {
      Location.findOne.mockResolvedValue(null);
      const cachedPlace = {
        id: locationId,
        displayName: { text: "Cached place" },
        formattedAddress: "Address 1",
        googleMapsUri: "https://maps.google.com",
        primaryType: "restaurant",
        location: { latitude: 10, longitude: 20 },
      };
      locationApiCache.get.mockReturnValue(cachedPlace);

      const newLocationDoc = { _id: "newloc" };
      Location.create.mockResolvedValue(newLocationDoc);
      Post.create.mockResolvedValue({ id: "post2" });

      const result = await postService.createPost(
        locationId,
        comment,
        userId,
        frontImageKey,
        backImageKey,
        frontHash,
        backHash
      );

      expect(locationApiCache.get).toHaveBeenCalledWith(locationId);
      expect(Location.create).toHaveBeenCalledWith({
        name: "Cached place",
        formattedAddress: cachedPlace.formattedAddress,
        placeId: cachedPlace.id,
        googleMapsUri: cachedPlace.googleMapsUri,
        primaryType: cachedPlace.primaryType,
        coordinates: {
          lat: cachedPlace.location.latitude,
          lng: cachedPlace.location.longitude,
        },
      });
      expect(Post.create).toHaveBeenCalledWith(
        expect.objectContaining({ location: newLocationDoc._id })
      );
      expect(result).toEqual({ id: "post2" });
    });
    it("wirft Fehler, wenn Location weder in DB noch im Cache ist", async () => {
      Location.findOne.mockResolvedValue(null);
      locationApiCache.get.mockReturnValue(undefined);

      await expect(
        postService.createPost(
          locationId,
          comment,
          userId,
          frontImageKey,
          backImageKey,
          frontHash,
          backHash
        )
      ).rejects.toThrow(
        "Location nicht in Datenbank oder Cache gefunden. Bitte erst abrufen."
      );
    });
  });
});
