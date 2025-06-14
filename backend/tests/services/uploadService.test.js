const AWS = require("aws-sdk");

jest.mock("aws-sdk", () => {
  const uploadMock = jest.fn().mockReturnThis();
  const promiseMock = jest.fn();
  const mS3 = { upload: uploadMock, promise: promiseMock };
  return { S3: jest.fn(() => mS3) };
});

const {
  validateImage,
  uploadToS3,
  uploadProfilePictureToS3,
} = require("../src/s3Utils"); 

describe("S3 utilities", () => {
  const BUCKET = "test-bucket";
  const REGION = "eu-central-1";

  beforeEach(() => {
    process.env.AWS_S3_BUCKET_NAME = BUCKET;
    process.env.AWS_ACCESS_KEY_ID = "FAKE_ID";
    process.env.AWS_SECRET_ACCESS_KEY = "FAKE_SECRET";
    process.env.AWS_REGION = REGION;

    jest.clearAllMocks();
  });

  describe("validateImage", () => {
    it("returns true for an allowed mimetype and size within the limit", () => {
      const file = { mimetype: "image/jpeg", size: 1024 };
      expect(validateImage(file)).toBe(true);
    });

    it("returns false for a disallowed mimetype", () => {
      const file = { mimetype: "text/plain", size: 1024 };
      expect(validateImage(file)).toBe(false);
    });

    it("returns false when the file exceeds the default size limit", () => {
      const file = { mimetype: "image/png", size: 4 * 1024 * 1024 };
      expect(validateImage(file)).toBe(false);
    });

    it("honours a custom maxbytes argument", () => {
      const file = { mimetype: "image/png", size: 2 * 1024 };
      expect(validateImage(file, 1 * 1024)).toBe(false);
    });
  });

  describe("uploadToS3", () => {
    it("uploads the file to S3 and resolves with the key", async () => {
      const mS3Instance = new AWS.S3();
      mS3Instance.promise.mockResolvedValue({});

      const file = {
        buffer: Buffer.from("dummy"),
        mimetype: "image/png",
      };
      const key = "folder/file.png";

      const result = await uploadToS3(file, key);

      expect(mS3Instance.upload).toHaveBeenCalledWith({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      expect(result).toBe(key);
    });
  });

