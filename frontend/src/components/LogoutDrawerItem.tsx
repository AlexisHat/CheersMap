import React from "react";
import { DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "../services/authService";
import { useUserStore } from "../store/profileStore";

type Props = {
  navigation: any;
};

const LogoutDrawerItem: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    await logout();
    useUserStore.getState().clearUser();
    navigation.closeDrawer();
  };

  return (
    <DrawerItem
      label="Logout"
      onPress={handleLogout}
      icon={({ size, color }) => (
        <MaterialIcons name="logout" size={size} color={color} />
      )}
      style={{ marginBottom: 4 }}
      labelStyle={{ fontWeight: "600" }}
    />
  );
};

export default LogoutDrawerItem;
