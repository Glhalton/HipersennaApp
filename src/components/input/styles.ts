import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  boxInput: {
    height: 45,
    backgroundColor: Colors.inputColor,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 30,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inputColor,
    fontFamily: "Lexend-Regular",
    borderRadius: 20,
    paddingLeft: 15,
  },
  label: {
    color: Colors.blue,
    marginBottom: 6,
    fontFamily: "Lexend-Regular",
    
  },
  iconLeft: {},
  iconRight: {},
});
