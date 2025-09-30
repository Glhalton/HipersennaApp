import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    backgroundColor: Colors.inputColor,
    borderRadius: 20,
    marginBottom: 10,
  },

  dropdownInput: {
    height: "100%",
    minHeight: 45,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 20,
    fontFamily: "Lexend-Regular",
    paddingLeft: 15,
  },
  optionsBox: {
    backgroundColor: "#F4F6F8",
    borderColor: "gray",
    paddingLeft: 4,
  },
  optionsText: {
    fontFamily: "Lexend-Regular",
  },
  placeholder: {
    fontFamily: "Lexend-Regular",
    opacity: 0.6,
  },
  label: {
    color: Colors.blue,
    marginBottom: 6,
    fontFamily: "Lexend-Regular",
  },
});
