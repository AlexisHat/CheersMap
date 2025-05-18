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
  Pressable,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { uploadPost } from "../services/uploadPostService";
import { styles } from '../styles/AppStyles';

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
  //const { location, backUri, frontUri } = route.params as RouteParams;
  const { location, backUri: initialBackUri, frontUri: initialFrontUri } = route.params as RouteParams;
   const [backUri, setBackUri] = useState<string>(initialBackUri);
  const [frontUri, setFrontUri] = useState<string>(initialFrontUri);


  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [swapped, setSwapped] = useState(false);

  const swapCameras = () => {
    const newBack = frontUri;
   const newFront = backUri;
   setBackUri(newBack);
   setFrontUri(newFront);
   setSwapped(prev => !prev);
  };

  const handleUpload = async () => {
    
    const uploadFrontUri = swapped ? backUri : frontUri;
    const uploadBackUri = swapped ? frontUri : backUri;

  try {
    const response = await uploadPost({
      locationId: location.id,
      frontUri: uploadFrontUri,
      backUri: uploadBackUri,
      comment,
    });
  }
    catch (error) {
      console.error("Fehler beim Hochladen:", error);
      setErrorMessage("Fehler beim Hochladen des Post");
    }
    console.log(uploadFrontUri);
  };
  
  return (
    <SafeAreaView style={{flex: 1}}>
              {/* Vollbild Hintergrundbild (Backkamera) */}
              <TextInput
            style={[styles.input, { marginHorizontal: 20 }]}
            placeholder="Was macht diesen Ort besonders?"
            value={comment}
            onChangeText={setComment}
            maxLength={300}
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="done"
          />
              <View style={{padding: 16, flex: 1}}>
              <View style={{flex: 1, position: "relative", borderRadius: 15, overflow: "hidden",}}>
              <Image source={{ uri: backUri }} style={styles.backPreviewImage} />
        
              {/* Frontkamera oben links */}
              <Pressable onPress={swapCameras}  style={styles.frontPreviewContainer}>
                <Image source={{ uri: frontUri }} style={styles.frontPreview} />
              </Pressable>
            </View>
            </View>
              {/* Buttons unten links und rechts */}
              
            
          
          
        
        <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>📍{location.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.registerButton, { marginHorizontal: 20 }]} onPress={handleUpload}>
          <Text style={styles.buttonText}>Post hochladen</Text>
        </TouchableOpacity>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        </View>
      </SafeAreaView>
  );
};

/*const styles = StyleSheet.create({
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
});*/
