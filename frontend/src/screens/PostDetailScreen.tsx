import { useRoute, RouteProp } from "@react-navigation/native";
import { View, Text, Image, ScrollView } from "react-native";
import { PostStackParamList } from "../navigation/PostStack";

export const PostDetailScreen = () => {
  type PostDetailRouteProp = RouteProp<PostStackParamList, "PostDetailScreen">;
  const route = useRoute<PostDetailRouteProp>();
  const { post } = route.params;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{post.comment}</Text>
      <Text style={{ color: "#666" }}>{post.location.name}</Text>
      <Image
        source={{ uri: post.frontImageUrl }}
        style={{ height: 200, marginVertical: 10 }}
      />
      <Image source={{ uri: post.backImageUrl }} style={{ height: 200 }} />
    </ScrollView>
  );
};
