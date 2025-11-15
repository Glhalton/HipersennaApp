import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  boxInput: {
    height: 45,
    backgroundColor: Colors.inputColor,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    borderRadius: 12,
    paddingLeft: 15,
  },
  label: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 16,
    marginBottom: 2,
  },
  iconLeft: {},
  iconRight: {},
});
