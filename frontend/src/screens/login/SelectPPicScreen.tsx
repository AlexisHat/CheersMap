import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { styles } from "../../styles/AppStyles";



export default function SelectPPicScreen({ route }: Props) {
  const { email, vorname, nachname, username, password } = route.params;

  const [city, setCity] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleFinalRegister = async () => {
    if (!city || !imageUri) {
      Alert.alert("Fehler", "Bitte wähle ein Bild und gib deine Stadt an.");
      return;
    }

    setLoading(true);
    // Hier kannst du jetzt alle Daten übergeben / an dein Backend schicken
    console.log("Alle Registrierungsdaten:", {
      email,
      vorname,
      nachname,
      username,
      password,
      city,
      imageUri,
    });

    Alert.alert("Erfolg", "Registrierung abgeschlossen!");
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text>Stadt</Text>
      <TextInput
        placeholder="z.B. Berlin"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />

      <Button title="Profilbild auswählen" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.ProfilePicPreview} />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title={loading ? "Registrieren..." : "Registrieren"}
          onPress={handleFinalRegister}
          disabled={loading}
        />
      </View>
    </View>
  );
}


