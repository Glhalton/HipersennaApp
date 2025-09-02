import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 45,
        marginBottom: 10,
        borderRadius: 20,
    },
    dataInputBox: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.inputColor,
        borderRadius: 20,
        justifyContent: "center"
    },
    dataInputText: {
        fontFamily: "Lexend-Regular",
        paddingLeft: 15,
    },
    label: {
        color: colors.blue,
        marginBottom: 6,
        fontFamily: "Lexend-Regular",
    },
})