import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CamScreen } from "../screens/CamScreen";
import { CreatePostScreen } from "../screens/CreatePostScreen";

export type PostStackParamList = {
  Cam: undefined;
  CreatePost: { backUri: string; frontUri: string };
};

const Stack = createNativeStackNavigator<PostStackParamList>();

export const PostStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cam"
        component={CamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
    </Stack.Navigator>
  );
};
