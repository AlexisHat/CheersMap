import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { captureDualPhotosWithCountdown } from "../services/dualCamService";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PostStackParamList } from "../navigation/PostStack";
import { styles } from '../styles/AppStyles';

export const CamScreen: React.FC = () => {
  const [permInfo, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const [backUri, setBackUri] = useState<string | null>(null);
  const [frontUri, setFrontUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");

  const swapCameras = () => {
    const temp = backUri;
    setBackUri(frontUri);
    setFrontUri(temp);
  };
  const navigation =
    useNavigation<NativeStackNavigationProp<PostStackParamList>>();

  const startCapture = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    const { back, front } = await captureDualPhotosWithCountdown(
      cameraRef,
      setCountdown,
      setFacing
    );
    setBackUri(back);
    setFrontUri(front);
    setBusy(false);
  };

  const reset = () => {
    setBackUri(null);
    setFrontUri(null);
    setCountdown(null);
    setFacing("back");
  };

  if (!permInfo) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Lade Berechtigungen…</Text>
      </View>
    );
  }

  if (!permInfo.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Kamerazugriff benötigt</Text>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Erlauben</Text>
        </Pressable>
      </View>
    );
  }

  /*if (backUri && frontUri) {
    return (
      <View style={styles.center}>
        <View>
          <Image source={{ uri: backUri }} style={styles.camera} />
      <Pressable onPress={swapCameras} style={styles.frontPreviewContainer}>
        <Image source={{ uri: frontUri }} style={styles.frontPreview} />
      </Pressable>
        </View>
        <Pressable onPress={reset} style={styles.button}>
          <Text style={styles.buttonText}>Neu aufnehmen</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("SelectLocation", { backUri, frontUri })
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Weiter</Text>
        </Pressable>
      </View>
    );
  }*/

    //von Chatgpt
    if (backUri && frontUri) {
      return (
        <SafeAreaView style={styles.flex}>
          {/* Vollbild Hintergrundbild (Backkamera) */}
          <Image source={{ uri: backUri }} style={styles.camera} />
    
          {/* Frontkamera oben links */}
          <Pressable onPress={swapCameras} style={styles.frontPreviewContainer}>
            <Image source={{ uri: frontUri }} style={styles.frontPreview} />
          </Pressable>
    
          {/* Buttons unten links und rechts */}
          <View style={styles.button}>
            <Pressable onPress={reset} style={styles.button}>
              <Text style={styles.buttonText}>Neu aufnehmen</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate("SelectLocation", { backUri, frontUri })
              }
              style={styles.button}
            >
              <Text style={styles.buttonText}>Weiter</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }


  return (
    <SafeAreaView style={styles.flex}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        responsiveOrientationWhenOrientationLocked
      />
      <View style={styles.overlay}>
        {countdown !== null ? (
          <Text style={styles.countdown}>{countdown}</Text>
        ) : (
          <Pressable
            onPress={startCapture}
            disabled={busy}
            style={styles.shutter}
          >
            <View style={styles.shutterInner} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};


