import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CamScreen } from "../screens/CamScreen";
import { SelectLocationScreen } from "../screens/SelectLocationScreen";
import { CreatePostScreen } from "../screens/CreatePostScreen";
import { LocationItem } from "../types/postTypes";
import { PostDetailScreen } from "../screens/PostDetailScreen";

export type PostStackParamList = {
  Cam: undefined;
  SelectLocation: { backUri: string; frontUri: string };
  CreatePost: { location: LocationItem; backUri: string; frontUri: string };
  PostDetailScreen: { post: any };
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
      <Stack.Screen name="SelectLocation" component={SelectLocationScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};
