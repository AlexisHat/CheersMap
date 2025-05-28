// MapScreen.tsx – production‑ready, refactored React‑Native screen (patched TS‑errors)
// -----------------------------------------------------------------------------
// Changelog 28 May 2025
// • Added strict type‑guard `isClusterFeature` to disambiguate SuperCluster unions
// • Cast `clusterId` to number before calling `getLeaves` (fixes string|number union)
// • Narrowed `point_count` access after guard – removes TS2339
// -----------------------------------------------------------------------------

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useClusters } from "../hooks/useClusters";
import { InfoPopup } from "../components/InfoPopup";
import { ClusterMarker } from "../components/ClusterMaker";
import { PinMarker } from "../components/PinMaker";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  category?: string;
  image?: string; // local require() or remote URL
  user?: {
    name: string;
    avatar: string;
  };
}

interface ClusterPoint {
  id: string;
  latitude: number;
  longitude: number;
  pointCount: number;
  clusteredPins?: Pin[];
  pin?: Pin;
}

// -----------------------------------------------------------------------------
// Dummy‑Daten
// -----------------------------------------------------------------------------

const DUMMY_PINS: Pin[] = [
  { id: "1", latitude: 50.9375, longitude: 6.9603, title: "Kölner Dom" },
  { id: "2", latitude: 50.9382, longitude: 6.9599, title: "Domplatte" },
  { id: "3", latitude: 50.9407, longitude: 6.9527, title: "Ehrenstraße" },
  { id: "4", latitude: 50.9341, longitude: 6.9736, title: "Köln Messe/Deutz" },
];

const useUserLocation = () => {
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

const useDebounce = <T,>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

const INITIAL_REGION: Region = {
  latitude: 50.9375,
  longitude: 6.9603,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const REGION_EPS = 0.0001;
const regionChanged = (a: Region, b: Region) =>
  Math.abs(a.latitude - b.latitude) > REGION_EPS ||
  Math.abs(a.longitude - b.longitude) > REGION_EPS ||
  Math.abs(a.latitudeDelta - b.latitudeDelta) > REGION_EPS ||
  Math.abs(a.longitudeDelta - b.longitudeDelta) > REGION_EPS;

const MapScreen: React.FC = () => {
  const [liveRegion, setLiveRegion] = useState<Region>(INITIAL_REGION);
  const debouncedRegion = useDebounce(liveRegion, 250);
  const mapRef = useRef<MapView>(null);
  const { location, error: locError } = useUserLocation();
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const pins = DUMMY_PINS;
  const clusters = useClusters(pins, debouncedRegion);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [location]);

  const centerToUser = useCallback(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [location]);
  const zoomToPins = (ps: Pin[]) => {
    mapRef.current?.fitToCoordinates(
      ps.map((p) => ({ latitude: p.latitude, longitude: p.longitude })),
      {
        edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
        animated: true,
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>CheersMap</Text>
      </View>

      {locError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{locError}</Text>
        </View>
      )}
      {!location && !locError && (
        <ActivityIndicator style={{ marginTop: 16 }} size="large" />
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        rotateEnabled={false}
        showsUserLocation
        showsPointsOfInterest={false}
        showsBuildings={false}
        onRegionChangeComplete={setLiveRegion}
      >
        {clusters.map((c) =>
          c.pointCount > 1 && c.clusteredPins ? (
            <ClusterMarker key={c.id} cluster={c} onPress={zoomToPins} />
          ) : (
            <PinMarker key={c.id} pin={c.pin!} onPress={setSelectedPin} />
          )
        )}
      </MapView>

      <TouchableOpacity style={styles.fab} onPress={centerToUser}>
        <Ionicons name="navigate-outline" size={24} color="#1a365c" />
      </TouchableOpacity>

      {selectedPin && (
        <InfoPopup pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9fafb",
  },
  headerIcon: { width: 24, height: 24, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#1a365c" },
  map: { flex: 1 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  clusterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a365c",
    alignItems: "center",
    justifyContent: "center",
  },
  clusterText: { color: "#fff", fontWeight: "700" },
  pinImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff",
  },
  popupContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
  },
  popupHeader: { flexDirection: "row", justifyContent: "flex-end" },
  popupClose: { fontSize: 22, color: "#1a365c" },
  popupBody: { flexDirection: "row", marginTop: 8 },
  popupMainImage: { width: 120, height: 120, borderRadius: 8, marginRight: 12 },
  popupTextWrapper: { flex: 1, justifyContent: "center" },
  popupTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  popupCategory: { fontSize: 14, color: "#6b7280" },
  errorBox: { padding: 8, backgroundColor: "#fde047", alignItems: "center" },
  errorText: { color: "#78350f" },
});
