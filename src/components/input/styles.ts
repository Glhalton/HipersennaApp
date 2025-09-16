import { StyleSheet } from "react-native"
import { Colors } from "../../../constants/colors"

export const styles = StyleSheet.create({
  boxInput: {
    width: "100%",
    height: 45,
    backgroundColor: Colors.inputColor,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 30,
    borderRadius: 20,
  },
  input: {
    height: "100%",
    width: "100%",
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
  iconLeft: {

  },
  iconRight: {

  }
})