import { useRoute, RouteProp } from "@react-navigation/native";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { PostStackParamList } from "../../navigation/PostStack";

type PostDetailRouteProp = RouteProp<PostStackParamList, "PostDetailScreen">;

export const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const { post, frontImageUrl, backImageUrl } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.comment}>{post.comment}</Text>
      <Text style={styles.location}>{post.location?.name}</Text>

      <Image
        source={{ uri: frontImageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Image
        source={{ uri: backImageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  comment: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
});
