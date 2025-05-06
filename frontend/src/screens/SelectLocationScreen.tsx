import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { fetchNearbyLocations } from "../services/locationService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostStackParamList } from "../navigation/PostStack";
import { useNavigation, useRoute } from "@react-navigation/native";

type LocationItem = {
  id: string;
  name: string;
};

type Props = NativeStackScreenProps<PostStackParamList, "SelectLocation">;

export const SelectLocationScreen: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<Props["navigation"]>();
  const route = useRoute<Props["route"]>();
  const { backUri, frontUri } = route.params;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied.");
          setLoading(false);
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        const data = await fetchNearbyLocations(
          coords.latitude,
          coords.longitude
        );
        setLocations(data);
      } catch (err) {
        setError("Failed to load locations.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelect = (placeId: string) => {
    navigation.navigate("CreatePost", {
      placeId,
      backUri,
      frontUri,
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading locations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wähle einen Ort</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item.id)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
});
