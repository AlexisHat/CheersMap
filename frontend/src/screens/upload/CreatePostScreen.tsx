import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { styles } from "../../styles/AppStyles";
import { PostStackParamList } from "../../navigation/PostStack";
import { uploadPost } from "../../services/uploadPostService";

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
  const {
    location,
    backUri: initialBackUri,
    frontUri: initialFrontUri,
  } = route.params as RouteParams;
  const [backUri, setBackUri] = useState<string>(initialBackUri);
  const [frontUri, setFrontUri] = useState<string>(initialFrontUri);

  type CreatePostNavigationProp = NativeStackNavigationProp<
    PostStackParamList,
    "CreatePost"
  >;
  const navigation = useNavigation<CreatePostNavigationProp>();

  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [swapped, setSwapped] = useState(false);

  const swapCameras = () => {
    const newBack = frontUri;
    const newFront = backUri;
    setBackUri(newBack);
    setFrontUri(newFront);
    setSwapped((prev) => !prev);
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
      console.log("Raw response:", response);
      navigation.navigate("PostDetailScreen", {
        post: response.post,
        frontImageUrl: response.frontImageUrl,
        backImageUrl: response.backImageUrl,
      });
    } catch (error) {
      console.error("Fehler beim Hochladen:", error);
      setErrorMessage("Fehler beim Hochladen des Post");
    }
    console.log(uploadFrontUri);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextInput
        style={[styles.input, { marginHorizontal: 20 }]}
        placeholder="Was macht diesen Ort besonders?"
        value={comment}
        onChangeText={setComment}
        maxLength={300}
        onSubmitEditing={() => Keyboard.dismiss()}
        returnKeyType="done"
      />
      <View style={{ padding: 16, flex: 1 }}>
        <View
          style={{
            flex: 1,
            position: "relative",
            borderRadius: 15,
            overflow: "hidden",
          }}
        >
          <Image source={{ uri: backUri }} style={styles.backPreviewImage} />

          <Pressable onPress={swapCameras} style={styles.frontPreviewContainer}>
            <Image source={{ uri: frontUri }} style={styles.frontPreview} />
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>📍{location.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.registerButton, { marginHorizontal: 20 }]}
          onPress={handleUpload}
        >
          <Text style={styles.buttonText}>Post hochladen</Text>
        </TouchableOpacity>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>
    </SafeAreaView>
  );
};
