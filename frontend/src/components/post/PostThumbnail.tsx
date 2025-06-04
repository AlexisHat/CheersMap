import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

type Props = {
  backCamUrl: string;
  frontCamUrl: string;
};

const PostThumbnail: React.FC<Props> = ({ backCamUrl, frontCamUrl }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: backCamUrl }} style={styles.backgroundImage} />

      <Image source={{ uri: frontCamUrl }} style={styles.overlayImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  overlayImage: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default PostThumbnail;
