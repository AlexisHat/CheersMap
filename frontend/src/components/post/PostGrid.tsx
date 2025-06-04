import React from "react";
import { FlatList, StyleSheet, View, Dimensions } from "react-native";
import PostThumbnail from "./PostThumbnail";

type Post = {
  id: string;
  frontCamUrl: string;
  backCamUrl: string;
};

type Props = {
  posts: Post[];
};

const screenWidth = Dimensions.get("window").width;
const spacing = 12;
const numColumns = 2;
const totalSpacing = spacing * (numColumns + 1);
const itemWidth = (screenWidth - totalSpacing) / numColumns;
const itemHeight = itemWidth * 1.33;

const PostGrid: React.FC<Props> = ({ posts }) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={{ gap: spacing, marginBottom: spacing }}
      contentContainerStyle={{ padding: spacing }}
      renderItem={({ item }) => (
        <View style={{ width: itemWidth, height: itemHeight }}>
          <PostThumbnail
            frontCamUrl={item.frontCamUrl}
            backCamUrl={item.backCamUrl}
          />
        </View>
      )}
    />
  );
};

export default PostGrid;
