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
import { styles } from '../styles/AppStyles';
import * as Haptics from 'expo-haptics'

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
        style={styles.registerButton}
        onPress={() => {
          handleRegister();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
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


