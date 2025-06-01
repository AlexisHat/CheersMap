import { View, Text, StyleSheet } from "react-native";

const StatBox: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default StatBox;

const styles = StyleSheet.create({
  statBox: {
    alignItems: "center",
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
});
