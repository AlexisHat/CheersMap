import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CamScreen } from "../screens/upload/CamScreen";
import { SelectLocationScreen } from "../screens/upload/SelectLocationScreen";
import { CreatePostScreen } from "../screens/upload/CreatePostScreen";
import { LocationItem } from "../types/postTypes";
import { PostDetailScreen } from "../screens/upload/PostDetailScreen";

export type PostStackParamList = {
  Cam: undefined;
  SelectLocation: { backUri: string; frontUri: string };
  CreatePost: { location: LocationItem; backUri: string; frontUri: string };
  PostDetailScreen: {
    post: any;
    frontImageUrl: string;
    backImageUrl: string;
  };
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
