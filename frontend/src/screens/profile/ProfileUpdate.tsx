import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { City } from "../../types/authTypes";
import { findNearestCity } from "../../helpers/authHelper";
import cities from "../../../assets/Orte-Deutschland.json";

import { styles } from "../../styles/AppStyles";
import { uploadProfilePicToS3 } from "../../services/uploadPostService";
import { updateProfile } from "../../services/profileService";
import useUserStore from "../../store/profileStore";

const CompleteProfileScreen: React.FC = async () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setProfilePicUrl, setMainCity } = useUserStore();

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const requestNearestCity = useCallback(async () => {
    setLoadingLocation(true);
    Keyboard.dismiss();
    setFilteredCities([]);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Standortberechtigung wurde verweigert");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const nearest = findNearestCity(coords.latitude, coords.longitude);

      if (nearest) {
        setCity(nearest.name);
        setQuery(nearest.name);
      }
    } catch (err) {
      console.error("Fehler bei der Standortermittlung:", err);
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);

    if (text.length > 1) {
      const matches = (cities as City[])
        .filter((c) => c.name.toLowerCase().startsWith(text.toLowerCase()))
        .slice(0, 10);
      setFilteredCities(matches);
    } else {
      setFilteredCities([]);
    }
  };

  const handleSelectCity = (cityName: string) => {
    setCity(cityName);
    setQuery(cityName);
    setFilteredCities([]);
  };

  let uploadedImageUrl: string | undefined;

  if (imageUri) {
    uploadedImageUrl = await uploadProfilePicToS3(imageUri);
    if (!uploadedImageUrl) {
      Alert.alert("Fehler", "Bild konnte nicht hochgeladen werden.");
      setLoading(false);
      return;
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await updateProfile(uploadedImageUrl, city);

      setProfilePicUrl(response.profilePicSignedUrl);
      setMainCity(response.city);
    } catch (error: any) {
      console.error("Update Fehler:", error.message);
      Alert.alert("Fehler", error.message || "Profil Update Fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil vervollständigen</Text>

      {imageUri ? (
        <View style={styles.ProfilePicWrapper}>
          <Image source={{ uri: imageUri }} style={styles.ProfilePicPreview} />
          <TouchableOpacity
            style={styles.trashIcon}
            onPress={() => setImageUri(null)}
          >
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Ionicons name="images-outline" size={48} color="#666" />
        </TouchableOpacity>
      )}

      <View style={styles.inputWithIcon}>
        <TextInput
          placeholder="Stadt (z.B. Berlin)"
          value={query}
          onChangeText={handleQueryChange}
          style={styles.inputField}
        />
        <TouchableOpacity onPress={requestNearestCity}>
          {loadingLocation ? (
            <ActivityIndicator />
          ) : (
            <Ionicons name="locate" size={24} color="#1a365c" />
          )}
        </TouchableOpacity>
      </View>

      {filteredCities.length > 0 && (
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleSelectCity(item.name)}
            >
              <Text style={styles.dropdownItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}

      <TouchableOpacity
        style={[
          styles.registerButton,
          loading && styles.registerButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Regestrierung Abschließen</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CompleteProfileScreen;
