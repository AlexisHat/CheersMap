import React, { useState } from "react";
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
} from "react-native";
import { login } from "../services/authService";
import { updateStoredTokens } from "../helpers/authHelper";
import { GOOGLE_CLIENT_ID } from "@env";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

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
