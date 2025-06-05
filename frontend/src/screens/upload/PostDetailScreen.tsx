import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
import { PostStackParamList } from "../../navigation/PostStack";
import PostThumbnail from "../../components/post/PostThumbnail";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";

type PostDetailRouteProp = RouteProp<PostStackParamList, "PostDetailScreen">;
type PostDetailNavigationProp = NativeStackNavigationProp<
  PostStackParamList,
  "PostDetailScreen"
>;

export const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation<PostDetailNavigationProp>();
  const { post, frontImageUrl, backImageUrl } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.successText}>Post wurde erfolgreich erstellt!</Text>

      <View style={styles.thumbnailWrapper}>
        <PostThumbnail frontCamUrl={frontImageUrl} backCamUrl={backImageUrl} />
      </View>
      <Pressable
        style={styles.button}
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Profile" }],
            })
          );
        }}
      >
        <Text style={styles.buttonText}>Okay</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  thumbnailWrapper: {
    width: "85%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#eee", // Leichtes Grau für leere Ladefläche
  },
  successText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
