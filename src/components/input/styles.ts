import { StyleSheet } from "react-native"
import colors from "../../../constants/colors"

export const styles = StyleSheet.create({
  boxInput: {
    width: "100%",
    height: 45,
    backgroundColor: colors.inputColor,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 30,
    borderRadius: 20,
  },
  input: {
    height: "100%",
    width: "100%",
    backgroundColor: colors.inputColor,
    fontFamily: "Lexend-Regular",
    borderRadius: 20,
    paddingLeft: 15,
  },
  label: {
    color: colors.blue,
    marginBottom: 6,
    fontFamily: "Lexend-Regular",
  },
  iconLeft:{

  },
  iconRight:{

  }
})