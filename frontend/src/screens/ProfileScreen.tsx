import { View, Text, Button, StyleSheet, Image, TextInput, TouchableOpacity,  FlatList } from "react-native";
import { useAuthStore } from "../store/authStore";
import { logout } from "../services/authService";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles/AppStyles";
import { Ionicons } from "@expo/vector-icons";
import cities from "../../assets/Orte-Deutschland.json";
import * as Location from "expo-location";



const ProfileScreen = () => {
  const handleLogout = async () => {
    await logout();
    await useAuthStore.getState().logout();
  };
  const getNearestCity = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Standortberechtigung wurde verweigert");
      return;
    }
  
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
  
    // Finde nächste Stadt
    const nearest = findNearestCity(latitude, longitude);
    setCity(nearest.name);     // dein TextInput-Feld
    setQuery(nearest.name);    // Autocomplete auch befüllen
  };
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Erdradius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const findNearestCity = (userLat, userLon) => {
    let nearest = null;
    let minDistance = Infinity;
  
    for (const city of cities) {
      const dist = haversineDistance(
        userLat,
        userLon,
        parseFloat(city.lon),
        parseFloat(city.lat)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = city;
      }
    }
  
    return nearest;
  };
  const [query, setQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [city, setCity] = useState("");

  const handleChange = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      const matches = cities
        .filter((c) =>
          c.name.toLowerCase().startsWith(text.toLowerCase())
        )
        .slice(0, 10); // max. 10 Vorschläge
      setFilteredCities(matches);
    } else {
      setFilteredCities([]);
    }
  };

  const handleSelect = (cityName: string) => {
    setCity(cityName);
    setQuery(cityName);
    setFilteredCities([]);
  };


  //const { email, vorname, nachname, username, password } = route.params;

  
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

  return (
    <View style={styles.container}>
      
        
        <View>
      <Text style={styles.title}>Profil vervollständigen</Text>

      {imageUri ? (
  <View style={styles.ProfilePicWrapper}>
    <Image source={{ uri: imageUri }} style={styles.ProfilePicPreview} />
    <TouchableOpacity style={styles.trashIcon} onPress={() => setImageUri(null)}>
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
    onChangeText={handleChange}
    style={styles.inputField}
  />
  <TouchableOpacity onPress={getNearestCity}>
    <Ionicons name="locate" size={24} color="#1a365c" />
  </TouchableOpacity>
</View>

{filteredCities.length > 0 && (
  <FlatList
    data={filteredCities}
    keyExtractor={(item) => item.name}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => handleSelect(item.name)}
      >
        <Text style={styles.dropdownItemText}>{item.name}</Text>
      </TouchableOpacity>
    )}
    style={styles.dropdown}
  />


      )}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => {}}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Registrieren</Text>
      </TouchableOpacity>
    </View>
    <Button onPress={handleLogout} title="Logout" />
    <TouchableOpacity onPress={getNearestCity}>
  <Text style={styles.buttonText}>Standort ermitteln</Text>
</TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;


