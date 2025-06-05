import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserSearchScreen from "../screens/users/UserSerachScreen";
import UserProfileScreen from "../screens/users/UserProfileScreen";

export type UserSearchParamList = {
  SearchUsers: undefined;
  UserProfile: {
    userId: string;
    profilePicUrl: string;
  };
};

const Stack = createNativeStackNavigator<UserSearchParamList>();

export const UserSearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchUsers" component={UserSearchScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};
