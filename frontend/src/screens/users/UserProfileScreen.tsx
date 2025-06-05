import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import api from "../../api/api";
import { UserProfileData } from "../../types/postTypes";
import ProfileAvatar from "../../components/user/ProfileAvatar";
import StatBox from "../../components/user/StatBox";
import PostGrid from "../../components/post/PostGrid";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserSearchParamList } from "../../navigation/UserSearchStack";

type Props = NativeStackScreenProps<UserSearchParamList, "UserProfile">;

const UserProfileScreen: React.FC<Props> = ({ route }) => {
  const { userId, profilePicUrl } = route.params;

  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const avatarSize = width * 0.35;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get<UserProfileData>(
          `/users/getprofile/${userId}`
        );
        setUserData(response.data);
      } catch (err: any) {
        setError(err.message || "Fehler beim Laden der Daten");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Fehler: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileAvatar uri={profilePicUrl} size={avatarSize} />
      <Text style={styles.username}>@{userData?.username}</Text>
      {userData?.city && <Text style={styles.city}>{userData?.city}</Text>}
      <View style={styles.statsRow}>
        <StatBox label="Follower" value={userData?.followers || 0} />
        <StatBox label="Folgt" value={userData?.following || 0} />
      </View>
      <View style={styles.postsSection}>
        <Text style={styles.postsHeading}>Beiträge</Text>
        <PostGrid posts={userData?.posts || []} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  username: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  city: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 24,
  },
  postsSection: {
    marginTop: 16,
    flex: 1,
  },
  postsHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
});

export default UserProfileScreen;
