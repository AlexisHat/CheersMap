import React from "react";
import { Image, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import type { Pin } from "../types/mapTypes";

export interface PinMarkerProps {
  pin: Pin;
  onPress: (pin: Pin) => void;
}

export const PinMarker: React.FC<PinMarkerProps> = ({ pin, onPress }) => (
  <Marker
    coordinate={{
      latitude: pin.latitude,
      longitude: pin.longitude,
    }}
    onPress={() => onPress(pin)}
  >
    <Image
      source={
        pin.image?.startsWith("http") || pin.image?.startsWith("file")
          ? { uri: pin.image }
          : require("../../assets/1.jpg")
      }
      style={styles.image}
    />
  </Marker>
);

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff",
  },
});
