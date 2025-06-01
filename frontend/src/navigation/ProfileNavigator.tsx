// navigation/ProfileNavigator.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import ProfileScreen from "../screens/profile/ProfileScreen";
import ProfileUpdateScreen from "../screens/profile/ProfileUpdateScreen";

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

const ProfileNavigator: React.FC = () => (
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
      options={{
        drawerLabel: "Profil",
      }}
    />
    <Drawer.Screen
      name="EditAccount"
      component={ProfileUpdateScreen}
      options={{
        drawerLabel: "Konto bearbeiten",
      }}
    />
  </Drawer.Navigator>
);

export default ProfileNavigator;
