import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { CamScreen } from "../screens/upload/CamScreen";
import Feather from "@expo/vector-icons/Feather";
import { PostStack } from "./PostStack";
import { View, Text } from "react-native";
import ProfileNavigator from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#1a365c",
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Camera"
        component={PostStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="camera" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={() => <ProfileNavigator nested />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
