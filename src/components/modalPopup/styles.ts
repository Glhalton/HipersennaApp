import { StyleSheet } from "react-native"
import { Colors } from "../../../constants/colors"

export const styles = StyleSheet.create({
    modalContainerCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        backgroundColor: "rgba(0, 0, 0, 0.53)",
    },
    modalBox: {
        padding: 30,
        height: 300,
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    modalButtonsBox: {
        flexDirection: "row",
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    titleText: {
        fontFamily: "Lexend-Bold",
        fontSize: 28,
        color: Colors.blue
    },
    text: {
        fontFamily: "Lexend-Regular",
        textAlign: "center",
        color: Colors.gray
    }
})