import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import ClusteredMapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

const pins = [
  {
    id: 1,
    title: "Kölner Dom",
    coordinate: { latitude: 50.941278, longitude: 6.958281 },
  },
  {
    id: 2,
    title: "Museum Ludwig",
    coordinate: { latitude: 50.941306, longitude: 6.960855 },
  },
  {
    id: 3,
    title: "Schokoladenmuseum Köln",
    coordinate: { latitude: 50.932255, longitude: 6.964943 },
  },
  {
    id: 4,
    title: "Hohenzollernbrücke",
    coordinate: { latitude: 50.941121, longitude: 6.973033 },
  },
  {
    id: 5,
    title: "Zoo Köln",
    coordinate: { latitude: 50.957187, longitude: 6.960803 },
  },
];

export default function MapScreen() {
  const mapRef = useRef(null);

  const handleMapRef = (ref) => {
    mapRef.current = ref;
  };

  // Dummy‑Callback zur Fehlervermeidung
  const noop = () => {};

  return (
    <View style={styles.container}>
      <ClusteredMapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 50.9375,
          longitude: 6.9603,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
        clusterColor="#3b82f6"
        animationEnabled
        showsUserLocation
        mapRef={handleMapRef}
        onRegionChangeComplete={noop} // 🔧 Fix für TypeError
      >
        {pins.map(({ id, coordinate, title }) => (
          <Marker key={id} coordinate={coordinate} title={title} />
        ))}
      </ClusteredMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
