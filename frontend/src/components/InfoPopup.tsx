import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import type { Pin } from "../types/mapTypes";

export interface InfoPopupProps {
  pin: Pin;
  onClose: () => void;
  style?: ViewStyle;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({
  pin,
  onClose,
  style,
}) => {
  const imageSource =
    pin.image?.startsWith("http") || pin.image?.startsWith("file")
      ? { uri: pin.image }
      : require("../../assets/1.jpg"); // fallback

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{pin.title ?? "Untitled place"}</Text>
          {pin.category && <Text style={styles.category}>{pin.category}</Text>}
          {pin.user?.name && (
            <Text style={styles.user}>Eingetragen von: {pin.user.name}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    fontSize: 22,
    color: "#1a365c",
  },
  body: {
    flexDirection: "row",
    marginTop: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#6b7280",
  },
  user: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 4,
  },
});
