import React, { memo, useCallback, useRef } from "react";
// @ts-ignore
import SuperCluster from "react-native-maps-super-cluster";
import { PROVIDER_GOOGLE, Region } from "react-native-maps";
import MarkerItem from "./MarkerItem";
import { View, Text, StyleSheet } from "react-native";
import { dummyMarkers, MarkerData } from "../../data/dummyMarkers";
const INITIAL_REGION: Region = {
  latitude: 50.9375,
  longitude: 6.9603,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

const ClusteredMap: React.FC = () => {
  const regionRef = useRef(INITIAL_REGION); // 👉 statt useState

  const onRegionChangeComplete = useCallback((region: Region) => {
    regionRef.current = region;
    // du kannst später z. B. regionRef.current.latitude verwenden
  }, []);

  const renderMarker = useCallback(
    (item: MarkerData) => <MarkerItem key={item.id} data={item} />,
    []
  );

  const renderCluster = useCallback(
    (cluster: any, onPress: () => void) => (
      <MarkerItem
        data={{
          id: `cluster-${cluster.pointCount}-${cluster.coordinate.latitude}-${cluster.coordinate.longitude}`,
          title: `${cluster.pointCount} Orte`,
          location: cluster.coordinate,
        }}
      >
        <View style={styles.clusterContainer} onTouchEnd={onPress}>
          <Text style={styles.clusterText}>{cluster.pointCount}</Text>
        </View>
      </MarkerItem>
    ),
    []
  );

  return (
    <SuperCluster
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION} // ✅ NICHT: region={}
      onRegionChangeComplete={onRegionChangeComplete}
      data={dummyMarkers}
      renderMarker={renderMarker}
      renderCluster={renderCluster}
      radius={50}
      maxZoom={20}
      animated
    />
  );
};

export default memo(ClusteredMap);

const styles = StyleSheet.create({
  clusterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3182ce",
    justifyContent: "center",
    alignItems: "center",
  },
  clusterText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
