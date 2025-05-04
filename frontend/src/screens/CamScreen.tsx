import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { captureDualPhotosWithCountdown } from "../services/dualCamService";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PostStackParamList } from "../navigation/PostStack";

export const CamScreen: React.FC = () => {
  const [permInfo, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const [backUri, setBackUri] = useState<string | null>(null);
  const [frontUri, setFrontUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");

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

  if (backUri && frontUri) {
    return (
      <View style={styles.center}>
        <View style={styles.previewRow}>
          <Image
            source={{ uri: backUri }}
            style={styles.thumb}
            contentFit="cover"
          />
          <Image
            source={{ uri: frontUri }}
            style={styles.thumb}
            contentFit="cover"
          />
        </View>
        <Pressable onPress={reset} style={styles.button}>
          <Text style={styles.buttonText}>Neu aufnehmen</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("CreatePost", { backUri, frontUri })
          }
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
        >
          <Text style={styles.buttonText}>Weiter</Text>
        </Pressable>
      </View>
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

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  previewRow: {
    flexDirection: "row",
    gap: 8,
  },
  thumb: {
    width: 120,
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  countdown: {
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#444",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingText: {
    color: "#fff",
  },
  permissionText: {
    color: "#fff",
    marginBottom: 12,
  },
  camera: {
    flex: 1,
  },
});
