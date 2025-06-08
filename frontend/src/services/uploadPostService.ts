import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import api from "../api/api";

export const compressImage = async (uri: string) => {
  try {
    const result = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 0.6,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    await FileSystem.deleteAsync(uri, { idempotent: true });

    return result.uri;
  } catch (error) {
    console.log("Fehler beim Komprimieren oder Löschen der Datei:", error);
  }
};

export const uploadPost = async (data: {
  locationId: string;
  frontUri: string;
  backUri: string;
  comment: string;
}) => {
  const { locationId, frontUri, backUri, comment } = data;
  try {
    const compressedFrontUri = await compressImage(frontUri);
    const compressedBackUri = await compressImage(backUri);

    const formData = new FormData();
    formData.append("locationId", locationId);
    formData.append("comment", comment);
    formData.append("frontImage", {
      uri: compressedFrontUri,
      name: "front.jpg",
      type: "image/jpeg",
    } as any);

    formData.append("backImage", {
      uri: compressedBackUri,
      name: "back.jpg",
      type: "image/jpeg",
    } as any);

    const response = await api.post("/upload/create-post", formData);

    return response.data;
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
    throw error;
  }
};

export const deleteLocalFiles = async (uris: string[]) => {
  try {
    await Promise.all(
      uris.map((uri) => FileSystem.deleteAsync(uri, { idempotent: true }))
    );
    console.log("Dateien erfolgreich gelöscht.");
  } catch (error) {
    console.error("Fehler beim Löschen von Dateien:", error);
  }
};

export const uploadProfilePicToS3 = async (pbUri: string) => {
  try {
    const formData = new FormData();
    formData.append("frontImage", {
      uri: pbUri,
      name: "ProfilePick.jpg",
      type: "image/jpeg",
    } as any);

    const response = await api.post("/upload/profilepicture", formData);

    return response.data.key;
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
    throw error;
  }
};
