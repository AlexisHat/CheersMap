import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import ClusteredMap from "../components/map/ClusteredMap";

const MapScreen = () => (
  <SafeAreaView style={styles.container}>
    <ClusteredMap />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default MapScreen;
