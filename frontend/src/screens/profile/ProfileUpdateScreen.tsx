import React, { useCallback, useEffect, useState } from "react";
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
import { useUserStore } from "../../store/profileStore";
import { useNavigation } from "@react-navigation/native";

const ProfileUpdateScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, setProfilePicUrl, setMainCity } = useUserStore();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [username, setUsername] = useState("");
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.city) {
      setCity(user.city);
      setQuery(user.city);
    }
    if (user?.username) {
      setUsername(user.username);
    }
    if (user?.profilePicUrl) {
      setImageUri(user.profilePicUrl);
    }
  }, [user]);

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let uploadedImageUrl: string | undefined;

      if (imageUri && imageUri !== user?.profilePicUrl) {
        uploadedImageUrl = await uploadProfilePicToS3(imageUri);
        if (!uploadedImageUrl) {
          Alert.alert("Fehler", "Bild konnte nicht hochgeladen werden.");
          return;
        }
      }

      const response = await updateProfile(uploadedImageUrl, city, username);
      setProfilePicUrl(response.profilePicSignedUrl);
      setMainCity(response.city);

      Alert.alert("Erfolg", "Profil wurde aktualisiert.");
      navigation.goBack();
    } catch (error: any) {
      console.error("Update Fehler:", error.message);
      Alert.alert("Fehler", error.message || "Profil Update Fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil bearbeiten</Text>

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
          placeholder="Benutzername"
          value={username}
          onChangeText={setUsername}
          style={styles.inputField}
        />
        <Ionicons name="person" size={24} color="#1a365c" />
      </View>

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
          <Text style={styles.buttonText}>Änderungen speichern</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfileUpdateScreen;
