import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  ButtonComponent: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ButtonComponentText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
});
