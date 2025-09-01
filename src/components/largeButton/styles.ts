import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

export const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        fontSize: 16,
        color: "white",
        fontFamily: "Lexend-Bold",

    }
})