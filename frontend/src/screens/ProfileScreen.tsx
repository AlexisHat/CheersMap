import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import {
  NavigationContainer,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import ProfileUpdateScreen from "./profile/ProfileUpdate";

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────

type User = {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  followers: number;
  following: number;
};

// Replace this with your real user/auth context or Redux selector
const mockUser: User = {
  id: "1",
  fullName: "John Doe",
  avatarUrl: null,
  followers: 391,
  following: 210,
};

// ────────────────────────────────────────────────────────────────────────────────
// Reusable Components
// ────────────────────────────────────────────────────────────────────────────────

const ProfileAvatar: React.FC<{ uri?: string | null; size?: number }> = ({
  uri,
  size = 120,
}) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        accessibilityLabel="Profilbild"
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#e4e4e7",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialIcons name="person" size={size * 0.6} color="#a3a3a3" />
    </View>
  );
};

const StatBox: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ────────────────────────────────────────────────────────────────────────────────
// Screens
// ────────────────────────────────────────────────────────────────────────────────

type DrawerNavProp = DrawerNavigationProp<ParamListBase>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavProp>();
  const { width } = useWindowDimensions();
  const avatarSize = width * 0.35;
  const user = mockUser; // Replace with real user data

  // Add the hamburger icon into the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user.fullName,
      // We override headerLeft so the default icon does not disappear when customising the header.
      headerLeft: () => (
        <Pressable
          accessibilityLabel="Öffne Menü"
          hitSlop={8}
          onPress={() => navigation.toggleDrawer()}
          style={{ paddingHorizontal: 12 }}
        >
          <MaterialIcons name="menu" size={24} color="#000" />
        </Pressable>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation, user.fullName]);

  return (
    <View style={styles.container}>
      <ProfileAvatar uri={user.avatarUrl} size={avatarSize} />
      <View style={styles.statsRow}>
        <StatBox label="Follower" value={user.followers} />
        <StatBox label="Folgt" value={user.following} />
      </View>
    </View>
  );
};

const EditAccountScreen: React.FC = () => (
  <View style={styles.centered}>
    <Text style={styles.placeholderText}>Bildschirm "Konto bearbeiten"</Text>
  </View>
);

// ────────────────────────────────────────────────────────────────────────────────
// Drawer Navigator
// ────────────────────────────────────────────────────────────────────────────────

const Drawer = createDrawerNavigator();

const CustomDrawerContent: React.FC<any> = (props) => (
  <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
    <DrawerItemList {...props} />
    <View style={{ flex: 1 }} />
    <DrawerItem
      label="Logout"
      onPress={() => {
        props.navigation.closeDrawer();
      }}
      icon={({ size, color }) => (
        <MaterialIcons name="logout" size={size} color={color} />
      )}
      style={{ marginBottom: 4 }}
      labelStyle={{ fontWeight: "600" }}
    />
  </DrawerContentScrollView>
);

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerTitleAlign: "center",
      drawerType: "slide",
      drawerActiveTintColor: "#1d4ed8",
      drawerLabelStyle: { fontSize: 16 },
    }}
  >
    <Drawer.Screen
      name="Profil"
      component={ProfileScreen}
      options={{ drawerLabel: "Profil" }}
    />
    <Drawer.Screen
      name="EditAccount"
      component={ProfileUpdateScreen}
      options={{ drawerLabel: "Konto bearbeiten" }}
    />
  </Drawer.Navigator>
);

interface Props {
  nested?: boolean;
}

const ProfileNavigator: React.FC<Props> = ({ nested = false }) => {
  if (nested) {
    return <DrawerNavigator />;
  }
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

export default ProfileNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 24,
  },
  statBox: {
    alignItems: "center",
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  placeholderText: {
    fontSize: 18,
    color: "#6b7280",
  },
});
