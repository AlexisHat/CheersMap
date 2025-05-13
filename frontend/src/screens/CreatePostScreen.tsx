import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { uploadPost } from "../services/uploadPostService";

type LocationItem = {
  id: string;
  name: string;
  address: string;
};

type RouteParams = {
  location: LocationItem;
  backUri: string;
  frontUri: string;
};

export const CreatePostScreen = () => {
  const route = useRoute();
  const { location, backUri, frontUri } = route.params as RouteParams;

  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async () => {
    try {
      const response = await uploadPost({
        locationId: location.id,
        frontUri,
        backUri,
        comment,
      });
      console.log("✅ Upload erfolgreich:", response.data);
    } catch (error) {
      console.error("Fehler beim Hochladen:", error);
      setErrorMessage("Fehler beim Hochladen des Post");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.heading}>📍 Ort</Text>
          <Text style={styles.subheading}>{location.name}</Text>
          <Text style={styles.address}>{location.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>📸 Deine Bilder</Text>
          <Image
            source={{ uri: frontUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <Image
            source={{ uri: backUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>📝 Kommentar</Text>
          <TextInput
            style={styles.input}
            placeholder="Was macht diesen Ort besonders?"
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={300}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonText}>Post hochladen</Text>
        </TouchableOpacity>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: "#555",
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#eee",
  },

  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
