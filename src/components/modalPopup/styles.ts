import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  modalContainerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "rgba(0, 0, 0, 0.53)",
  },
  modalBox: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  textBox: {
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonsBox: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  titleText: {
    fontFamily: "Roboto-Bold",
    fontSize: 28,
    color: Colors.blue,
  },
  text: {
    fontFamily: "Roboto-Regular",
    textAlign: "center",
    color: Colors.gray,
  },
});
