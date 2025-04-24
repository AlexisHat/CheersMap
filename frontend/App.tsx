import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "./src/store/authStore";
import TabNavigator from "./src/navigation/TabNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import AuthStack from "./src/navigation/AuthStack";

export default function App() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkLoginStatus = useAuthStore((state) => state.checkLoginStatus);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
