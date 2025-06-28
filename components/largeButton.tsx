import React from "react";
import { Text, Pressable, StyleSheet, GestureResponderEvent, } from "react-native";

import { router, LinkProps } from "expo-router";

type Props = {
    title: string;
    style?: any;
    screenLink: LinkProps["href"];
}

export default function LargeButton({title, style, screenLink}: Props){
    const botaoPressionado = () => {
        router.push(screenLink)
    }

    return(
        <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button:{
        display: "flex",
        height: 48,
        width: 358,
        backgroundColor: "#DA0100",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center"
    
    },
    buttonText:{
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    }
})