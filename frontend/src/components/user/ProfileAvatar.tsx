import { View, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileAvatar: React.FC<{ uri?: string | null; size?: number }> = ({
  uri,
  size = 120,
}) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        accessibilityLabel="Profilbild"
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#e4e4e7",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialIcons name="person" size={size * 0.6} color="#a3a3a3" />
    </View>
  );
};

export default ProfileAvatar;
