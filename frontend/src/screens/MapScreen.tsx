import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// ⚠️ Dummy-Daten für Pins
const pins = [
  { id: '1', latitude: 48.8566, longitude: 2.3522 },
  { id: '2', latitude: 48.8567, longitude: 2.3523 },
  { id: '3', latitude: 48.8565, longitude: 2.3521 },
  { id: '4', latitude: 48.8600, longitude: 2.3500 },
];
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
export default function MapScreen() {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedPin, setSelectedPin] = useState(null);
  
 

  const [clusteredPins, setClusteredPins] = useState([]);

  useEffect(() => {
    debouncedClusterPins();
  }, [region]);
  

  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };

  const clusterPins = async () => {
    if (!mapRef.current) return;
  
    const pixelThreshold = 50; // Abstand in px für visuelles Clustering
    const projectedPins = await Promise.all(
      pins.map(async (pin) => {
        const screenPoint = await mapRef.current.pointForCoordinate({
          latitude: pin.latitude,
          longitude: pin.longitude,
        });
        return { ...pin, screenPoint };
      })
    );
  
    const clustered = [];
    const used = new Set();
  
    for (let i = 0; i < projectedPins.length; i++) {
      if (used.has(projectedPins[i].id)) continue;
  
      const group = [projectedPins[i]];
      const { x: x1, y: y1 } = projectedPins[i].screenPoint;
  
      for (let j = i + 1; j < projectedPins.length; j++) {
        const { x: x2, y: y2 } = projectedPins[j].screenPoint;
        const distPx = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
        if (distPx < pixelThreshold) {
          group.push(projectedPins[j]);
          used.add(projectedPins[j].id);
        }
      }
  
      clustered.push({
        id: 'cluster_' + group[0].id,
        latitude: average(group.map(p => p.latitude)),
        longitude: average(group.map(p => p.longitude)),
        count: group.length,
        pins: group,
      });
  
      used.add(projectedPins[i].id);
    }
  
    setClusteredPins(clustered);
  };
  const debouncedClusterPins = useRef(debounce(clusterPins, 300)).current;

  const getDistance = (a, b) => {
    const dx = a.latitude - b.latitude;
    const dy = a.longitude - b.longitude;
    return Math.sqrt(dx * dx + dy * dy) * 111000; // Meter
  };

  const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const renderMarkers = () => {
    return clusteredPins.map((pin) => {
      if (pin.count && pin.count > 1) {
        return (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          >
            <View style={styles.cluster}>
              <Text style={styles.clusterText}>{pin.count}</Text>
            </View>
          </Marker>
        );
      }

      return (
        <Marker
          key={pin.id}
          coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          onPress={() => setSelectedPin(pin)}
        >
          <Image
            source={require('../../assets/1.jpg')}
            style={styles.image}
          />
        </Marker>
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {renderMarkers()}
      </MapView>
      {selectedPin && (
  <View style={styles.popupContainer}>
  {/* Linker Bildbereich mit Main + Frontcam */}
  <View style={styles.imageWrapper}>
    <Image
      source={require('../../assets/1.jpg')} // Main Cam
      style={styles.mainImage}
    />
    <Image
      source={require('../../assets/1.jpg')} // Front Cam (demo)
      style={styles.frontCam}
    />
  </View>

  {/* Rechte Textseite */}
  <View style={styles.infoWrapper}>
    {/* Close Button */}
    <TouchableOpacity onPress={() => setSelectedPin(null)} style={styles.closeButton}>
      <Text style={{ fontSize: 18 }}>✕</Text>
    </TouchableOpacity>

    {/* Profilbild + Username */}
    <View style={styles.userRow}>
      <Image
        source={require('../../assets/2.jpg')} // Demo-Profilbild
        style={styles.profilePic}
      />
      <Text style={styles.username}>User XY</Text>
    </View>

    {/* Ort & Kategorie */}
    <Text style={styles.placeName}>Café Central</Text>
    <Text style={styles.category}>Coffee • Vegan</Text>
  </View>
</View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFF'
  },
  cluster: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  popupContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'flex-start',
  },
  
  imageWrapper: {
    width: 120,
    height: 120,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  frontCam: {
    width: 36,
    height: 36,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    top: 6,
    left: 6,
  },
  
  infoWrapper: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    zIndex: 2,
  },
  
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 6,
  },
  
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  
  category: {
    fontSize: 14,
    color: '#888',
  },
  
  
});
