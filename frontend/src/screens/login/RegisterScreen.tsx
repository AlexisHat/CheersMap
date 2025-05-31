import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../types/authTypes";
import { register } from "../../services/authService";
import { RegisterRequest } from "../../types/authTypes";
import { styles } from "../../styles/AppStyles";
import * as Haptics from "expo-haptics";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      Alert.alert("Erfolg", "Registrierung erfolgreich! ");
    } catch (error: any) {
      Alert.alert("Registrierung fehlgeschlagen", error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field: string, value: string) => {
    let message = "";
    if (field === "email" && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value)) {
      message = "Bitte gib eine gültige E-Mail-Adresse ein.";
    } else if (
      (field === "vorname" || field === "nachname") &&
      !/^[a-zA-ZäöüÄÖÜß\- ]+$/.test(value)
    ) {
      message = "Nur Buchstaben, Leerzeichen und Bindestriche erlaubt.";
    } else if (field === "username" && !/^[a-z0-9.-]+$/.test(value)) {
      message = "Nur Kleinbuchstaben, Zahlen, Punkte und Bindestriche erlaubt.";
    } else if (field === "password") {
      if (value.length < 8) {
        message = "Passwort muss mindestens 8 Zeichen lang sein.";
      } else if (!/[a-z]/.test(value)) {
        message = "Passwort muss mindestens einen Kleinbuchstaben enthalten.";
      } else if (!/[A-Z]/.test(value)) {
        message = "Passwort muss mindestens einen Großbuchstaben enthalten.";
      } else if (!/\d/.test(value)) {
        message = "Passwort muss mindestens eine Zahl enthalten.";
      }
    }
    setErrors((prev) => {
      const updated = { ...prev, [field]: message };

      return updated;
    });
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
        onChangeText={(text) => {
          setVorname(text);
          validateField("vorname", text);
        }}
      />
      {errors.vorname ? (
        <Text style={styles.error}>{errors.vorname}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Nachname"
        autoCapitalize="words"
        value={nachname}
        onChangeText={(text) => {
          setNachname(text);
          validateField("nachname", text);
        }}
      />
      {errors.nachname ? (
        <Text style={styles.error}>{errors.nachname}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Benutzername"
        autoCapitalize="none"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          validateField("username", text);
        }}
      />
      {errors.username ? (
        <Text style={styles.error}>{errors.username}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validateField("password", text);
        }}
      />
      {errors.password ? (
        <Text style={styles.error}>{errors.password}</Text>
      ) : null}

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
