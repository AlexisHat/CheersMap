import { Text, View, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  return (
    <View>
      <Text>Hier kann die Map hinkommen</Text>
      <MapView
        style={{ height: 300, width: "100%" }}
        initialRegion={{
          latitude: 52.52,
          longitude: 13.405,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 52.52, longitude: 13.405 }}
          title="Du bist hier"
        />
      </MapView>
    </View>
  );
};

export default MapScreen;
