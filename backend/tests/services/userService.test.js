const mongoose = require("mongoose");
const User = require("../models/User");
const awsService = require("../services/awsService");
const postService = require("../services/postService");

const userService = require("../services/userService");

jest.mock("../models/User");
jest.mock("../services/awsService");
jest.mock("../services/postService");

describe("userService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("searchUsersByQuery", () => {
    it("should throw an error for invalid or short query", async () => {
      await expect(userService.searchUsersByQuery("")).rejects.toThrow(
        "Suchbegriff ist zu kurz oder ungültig."
      );
      await expect(userService.searchUsersByQuery("a")).rejects.toThrow(
        "Suchbegriff ist zu kurz oder ungültig."
      );
      await expect(userService.searchUsersByQuery(null)).rejects.toThrow(
        "Suchbegriff ist zu kurz oder ungültig."
      );
    });

    it("should find users and return profiles with signed URLs", async () => {
      const mockUsers = [
        { _id: "1", username: "alice", profilePicKey: "key1" },
        { _id: "2", username: "alex", profilePicKey: null },
      ];
      User.find.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUsers),
      });
      awsService.getSignedUrl.mockImplementation(
        (key) => `https://signedurl/${key}`
      );

      const result = await userService.searchUsersByQuery("al");

      expect(User.find).toHaveBeenCalledWith({
        username: { $regex: /^al/i },
      });
      expect(result).toEqual([
        { _id: "1", username: "alice", profileImage: "https://signedurl/key1" },
        { _id: "2", username: "alex", profileImage: null },
      ]);
    });
  });

  describe("getUserProfileForId", () => {
    it("should throw if user not found", async () => {
      User.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      await expect(userService.getUserProfileForId("someId")).rejects.toThrow(
        "USER_NOT_FOUND"
      );
    });

    it("should return user profile with posts", async () => {
      const mockUser = { _id: "1", username: "alice", city: "Berlin" };
      const mockPosts = [{ _id: "p1" }, { _id: "p2" }];
      User.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUser),
      });
      postService.getPostPreviewsFor.mockResolvedValue(mockPosts);

      const result = await userService.getUserProfileForId("1");

      expect(result).toEqual({
        username: "alice",
        followers: 0,
        following: 0,
        city: "Berlin",
        posts: mockPosts,
      });
    });
  });

  describe("getProfiledPicUrlForUser", () => {
    it("should throw if user not found", async () => {
      User.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      await expect(userService.getProfiledPicUrlForUser("abc")).rejects.toThrow(
        "USER_NOT_FOUND"
      );
    });

    it("should return null if no profilePicKey", async () => {
      User.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ profilePicKey: null }),
      });
      const result = await userService.getProfiledPicUrlForUser("abc");
      expect(result).toBeNull();
    });

    it("should return signed URL if profilePicKey exists", async () => {
      User.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ profilePicKey: "abc" }),
      });
      awsService.getSignedUrl.mockReturnValue("signed-url");
      const result = await userService.getProfiledPicUrlForUser("abc");
      expect(result).toBe("signed-url");
    });
  });
});
