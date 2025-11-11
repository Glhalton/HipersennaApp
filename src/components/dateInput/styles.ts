import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    borderRadius: 20,
  },
  dataInputBox: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.inputColor,
    borderRadius: 20,
    justifyContent: "center",
  },
  dataInputText: {
    fontFamily: "Roboto-Regular",
    paddingLeft: 15,
  },
  label: {
    color: Colors.blue,
    marginBottom: 6,
    fontFamily: "Roboto-Regular",
  },
});
