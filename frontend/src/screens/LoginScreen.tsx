import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types/authTypes";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { login } from "../services/authService";
import { updateStoredTokens } from "../helpers/authHelper";
import { GOOGLE_CLIENT_ID } from "@env";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectUri = "https://auth.expo.io/@cheersmap/frontend";
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // Sende authentication.idToken oder authentication.accessToken an dein Backend!
      console.log(authentication);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Fehler", "Bitte gib E-Mail und Passwort ein.");
      return;
    }

    try {
      setLoading(true);

      const { accessToken, refreshToken } = await login({ username, password });

      await updateStoredTokens(accessToken, refreshToken);
    } catch (error: any) {
      Alert.alert("Login fehlgeschlagen", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen zurück 👋</Text>
      <Text style={styles.subtitle}>Bitte melde dich an, um fortzufahren</Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Einloggen..." : "Einloggen"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#db4437" }]}
        disabled={!request}
        onPress={() => {
          // 1️⃣ Redirect-URI ausgeben
          console.log("Redirect URI, die an Google geht:", redirectUri);

          // 2️⃣ Login auslösen und Ergebnis loggen
          promptAsync()
            .then((r) => console.log("OAuth-Response:", r))
            .catch((e) => console.log("OAuth-Error:", e));
        }}
      >
        <Text style={styles.buttonText}>Mit Google anmelden</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Passwort vergessen?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ marginTop: 20, textAlign: "center", color: "#007bff" }}>
          Noch keinen Account? Jetzt registrieren
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 15,
    textAlign: "center",
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
