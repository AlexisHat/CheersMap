import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

type LocationItem = {
  id: string;
  name: string;
  address: string;
};

type RouteParams = {
  location: LocationItem;
  backUri: string;
  frontUri: string;
};

export const CreatePostScreen = () => {
  const route = useRoute();
  const { location, backUri, frontUri } = route.params as RouteParams;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ort</Text>
      <Text>ID: {location.id}</Text>
      <Text>Name: {location.name}</Text>
      <Text>Adresse: {location.address}</Text>

      <Text style={styles.title}>Fotos</Text>
      <Image source={{ uri: frontUri }} style={styles.image} />
      <Image source={{ uri: backUri }} style={styles.image} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginVertical: 12,
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 400,
    marginVertical: 12,
    resizeMode: "cover",
    borderRadius: 10,
  },
});
