import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/login/LoginScreen";
import RegisterScreen from "../screens/login/RegisterScreen";
import ProfileCreation from "../screens/login/ProfileCreation";
import { AuthStackParamList } from "../types/authTypes";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ProfileCreation" component={ProfileCreation} />
    </Stack.Navigator>
  );
}
