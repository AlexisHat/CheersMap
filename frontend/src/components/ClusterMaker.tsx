import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import type { ClusterPoint, Pin } from "../types/mapTypes";

export interface ClusterMarkerProps {
  cluster: ClusterPoint;
  onPress: (pins: Pin[]) => void;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  cluster,
  onPress,
}) => (
  <Marker
    coordinate={{
      latitude: cluster.latitude,
      longitude: cluster.longitude,
    }}
    onPress={() => onPress(cluster.clusteredPins!)}
  >
    <View style={styles.container}>
      <Text style={styles.text}>{cluster.pointCount}</Text>
    </View>
  </Marker>
);

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a365c",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
  },
});
