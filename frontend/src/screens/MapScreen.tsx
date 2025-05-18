import { Text, View, StyleSheet, Platform, Image } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';

const pins = [
  { id: '1', latitude: 48.8566, longitude: 2.3522 }, // Paris
  { id: '2', latitude: 48.8577, longitude: 2.3522 }, // Paris
  { id: '3', latitude: 48.8566, longitude: 2.3511 }, // Paris
  { id: '4', latitude: 48.8555, longitude: 2.3522 }, // Paris
  //{ id: '2', latitude: 35.6895, longitude: 139.6917 }, // Tokyo
  //{ id: '3', latitude: -33.8688, longitude: 151.2093 }, // Sydney
  //{ id: '4', latitude: 40.7128, longitude: -74.006 }, // New York
];

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 20,
    longitude: 0,
    latitudeDelta: 100,
    longitudeDelta: 100,
  });

  const [zoomLevel, setZoomLevel] = useState(1);

  const mapRef = useRef(null);

  // Zoom-Level berechnen bei Region-Änderung
  useEffect(() => {
    const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    setZoomLevel(zoom);
  }, [region]);

  return (
    <View style={{ flex: 1 }}>
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={region}
      customMapStyle={cleanMapStyle}
      onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
    >
      {pins.map((pin) => (
        <Marker
           key={`${pin.id}-${zoomLevel >= 13 ? 'img' : 'dot'}`}
           coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
           tracksViewChanges={zoomLevel >= 13}     // nur wenn Bild gezeigt wird
         >
          {zoomLevel >= 13 ? (
            <Image
                   source={require('../../assets/1.jpg')}
                   style={styles.image}
                   onLoadEnd={() => mapRef.current?.setNativeProps({})} /* oder state setzen */
                 />
          ) : (
            <View style={styles.dot} />
          )}
        </Marker>
      ))}
    </MapView>
    <View pointerEvents="none" style={styles.mapOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.1)", // leicht milchig
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    borderWidth: 2,
  borderColor: "#1a365c",
  },
  dot: {
  width: 30,
  height: 30,
  backgroundColor: "#1a365c",
  borderRadius: 15, // macht ihn kreisförmig
  alignItems: "center",
  justifyContent: "center",

  // Spitze erzeugen
  transform: [{ rotate: "45deg" }],
  marginBottom: 15, // Position etwas anpassen
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
  elevation: 2,
},
});

const cleanMapStyle = [
  
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "2.00"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#9c9c9c"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#7b7b7b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c8d7d4"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#070707"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }




];