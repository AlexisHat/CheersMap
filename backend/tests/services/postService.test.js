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

    describe("getPostPreviewsFor", () => {
      it("liefert signierte URLs für die letzten 20 Posts", async () => {
        const posts = [
          { _id: "p1", frontImageKey: "f1", backImageKey: "b1" },
          { _id: "p2", frontImageKey: "f2", backImageKey: "b2" },
        ];

        const chain = {
          sort: jest.fn(),
          limit: jest.fn(),
          lean: jest.fn(),
        };
        chain.sort.mockReturnValue(chain);
        chain.limit.mockReturnValue(chain);
        chain.lean.mockResolvedValue(posts);
        Post.find.mockReturnValue(chain);

        getSignedUrl.mockImplementation(
          (key) => `https://s3.amazonaws.com/bucket/${key}`
        );

        const result = await postService.getPostPreviewsFor(userId);

        expect(Post.find).toHaveBeenCalledWith({ user: userId });
        expect(chain.sort).toHaveBeenCalledWith({ createdAt: -1 });
        expect(chain.limit).toHaveBeenCalledWith(20);
        expect(chain.lean).toHaveBeenCalled();

        expect(result).toEqual([
          {
            id: "p1",
            frontCamUrl: "https://s3.amazonaws.com/bucket/f1",
            backCamUrl: "https://s3.amazonaws.com/bucket/b1",
          },
          {
            id: "p2",
            frontCamUrl: "https://s3.amazonaws.com/bucket/f2",
            backCamUrl: "https://s3.amazonaws.com/bucket/b2",
          },
        ]);
      });
    });

    describe("findDuplicate", () => {
      it("ruft Post.findOne mit dem richtigen Query auf", async () => {
        const duplicateDoc = { _id: "dup1" };
        Post.findOne.mockResolvedValue(duplicateDoc);

        const result = await postService.findDuplicate(
          userId,
          frontHash,
          backHash
        );

        expect(Post.findOne).toHaveBeenCalledWith({
          user: userId,
          imageHashFront: frontHash,
          imageHashBack: backHash,
        });
        expect(result).toBe(duplicateDoc);
      });
    });
  });
});
