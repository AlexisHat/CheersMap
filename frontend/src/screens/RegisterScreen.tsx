import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types/authTypes";
import { register } from "../services/authService";
import { RegisterRequest } from "../types/authTypes";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleRegister = async () => {
    if (!email || !vorname || !nachname || !username || !password) {
      Alert.alert("Fehler", "Bitte fülle alle Felder aus.");
      return;
    }

    const userData: RegisterRequest = {
      email,
      vorname,
      nachname,
      username,
      password,
    };

    try {
      setLoading(true);
      await register(userData);
      Alert.alert(
        "Erfolg",
        "Registrierung erfolgreich! Du kannst dich nun einloggen."
      );
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Registrierung fehlgeschlagen", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Erstelle einen Account</Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Vorname"
        autoCapitalize="words"
        value={vorname}
        onChangeText={setVorname}
      />

      <TextInput
        style={styles.input}
        placeholder="Nachname"
        autoCapitalize="words"
        value={nachname}
        onChangeText={setNachname}
      />

      <TextInput
        style={styles.input}
        placeholder="Benutzername"
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
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registrieren..." : "Registrieren"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.forgotPassword}>
          Schon ein Konto? Jetzt einloggen
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
