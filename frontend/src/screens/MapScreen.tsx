import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import ClusteredMapView from "react-native-map-clustering";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";

// Falls du DUMMY_PINS separat halten möchtest, kannst du diese Datei importieren.
const DUMMY_PINS = [
  { id: "1", latitude: 50.9375, longitude: 6.9603, title: "Kölner Dom" },
  { id: "2", latitude: 50.9382, longitude: 6.9599, title: "Domplatte" },
  { id: "3", latitude: 50.9407, longitude: 6.9527, title: "Ehrenstraße" },
  { id: "4", latitude: 50.9341, longitude: 6.9736, title: "Köln Messe/Deutz" },
  { id: "5", latitude: 50.9376, longitude: 6.9601, title: "Severinsbrücke" },
  {
    id: "6",
    latitude: 50.9373,
    longitude: 6.9605,
    title: "Römisch-Germanisches Museum",
  },
  {
    id: "7",
    latitude: 50.9378,
    longitude: 6.9604,
    title: "Hohenzollernbrücke",
  },
  { id: "8", latitude: 50.9338, longitude: 6.9734, title: "Lanxess Arena" },
  { id: "9", latitude: 50.9344, longitude: 6.9738, title: "Deutzer Freiheit" },
  { id: "10", latitude: 50.9342, longitude: 6.974, title: "Rheinpark" },
  { id: "11", latitude: 50.948, longitude: 6.931, title: "Volksgarten" },
  { id: "12", latitude: 50.9265, longitude: 6.9624, title: "Zoo Köln" },
  { id: "13", latitude: 50.951, longitude: 6.96, title: "Rathenauplatz" },
  { id: "14", latitude: 50.962, longitude: 6.95, title: "Weißer Löwe" },
  {
    id: "15",
    latitude: 50.943,
    longitude: 6.979,
    title: "Kloster Groß St. Martin",
  },
] as const;

export const useUserLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        mounted && setError("Location permission denied");
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: 5 });
        mounted && setLocation(loc);
      } catch (e) {
        mounted && setError((e as Error).message);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { location, error } as const;
};

const MapScreen: React.FC = () => {
  const { location, error } = useUserLocation();
  const mapRef = useRef<MapView | null>(null);

  // Köln‑Zentrum als Startregion
  const initialRegion = {
    latitude: 50.9375,
    longitude: 6.9603,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } as const;

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ClusteredMapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onRegionChangeComplete={() => {}}
        animationEnabled
        // 👉 **mapRef als Funktion** übergeben, damit die Bib nichts mehr vermisst
        mapRef={(ref) => {
          mapRef.current = ref;
        }}
        // (optional) selber noch als ref behalten
        ref={mapRef}
        showsUserLocation={!!location}
        provider={PROVIDER_GOOGLE}
      >
        {DUMMY_PINS.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={pin.title}
          />
        ))}
      </ClusteredMapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MapScreen;
