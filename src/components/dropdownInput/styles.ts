import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    backgroundColor: Colors.inputColor,
    borderRadius: 12, 
  },
  dropdownInput: {
    height: "100%",
    minHeight: 45,
    zIndex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    fontFamily: "Roboto-Regular",
    paddingLeft: 15,
    fontSize: 16,
  },
  optionsBox: {
    backgroundColor: "#F4F6F8",
    borderWidth: 1.5,
    paddingLeft: 4,
  },
  optionsText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    
  },
  placeholder: {
    fontFamily: "Roboto-Regular",
  },
  label: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 16,
    marginBottom: 2,
  },
});
