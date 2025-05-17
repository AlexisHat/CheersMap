import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types/authTypes";
import * as Haptics from 'expo-haptics'
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
import { styles } from '../styles/AppStyles';

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        placeholder="Username"
        autoCapitalize="none"
        autoCorrect={false}
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
        style={styles.loginButton}
        onPress={() => {
          //Haptics.impactAsync();
          
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          handleLogin();
        }}
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
        <Text style={styles.forgotPassword}>
          Noch keinen Account? Jetzt registrieren
        </Text>
      </TouchableOpacity>
    </View>
  );
}


