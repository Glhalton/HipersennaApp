import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    maxWidth: 250,
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
  },
});
