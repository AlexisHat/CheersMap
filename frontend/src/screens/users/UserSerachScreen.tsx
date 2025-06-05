import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import api from "../../api/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserSearchParamList } from "../../navigation/UserSearchStack";

interface User {
  _id: string;
  username: string;
  name: string;
  profileImage: string;
}

type Navigation = NativeStackNavigationProp<UserSearchParamList, "SearchUsers">;

export default function UserSearchScreen() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const navigation = useNavigation<Navigation>();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      searchUsers(query);
    }, 300);

    setTypingTimeout(timeout);
  }, [query]);

  const searchUsers = async (text: string) => {
    try {
      const res = await api.get(`/users/search?query=${text}`);
      setResults(res.data);
    } catch (err) {
      console.log("Suchfehler:", err);
    }
  };

  const handleUserPress = (user: User) => {
    navigation.navigate("UserProfile", {
      userId: user._id,
      profilePicUrl: user.profileImage ?? "",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          placeholder="Benutzer suchen..."
          value={query}
          onChangeText={(text) => setQuery(text)}
          style={styles.input}
        />
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleUserPress(item)}
              style={styles.userItem}
            >
              <Image
                source={
                  item.profileImage
                    ? { uri: item.profileImage }
                    : require("../../../assets/seafood_restaurant.png")
                }
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  name: {
    color: "#666",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
