import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: "10%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 14,
    backgroundColor: Colors.red2,
    elevation: 3,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    color: "white",
  },
  button: {
    padding: 5,
  },
  gearIcon: {
    width: 25,
    height: 25,
  },
});
