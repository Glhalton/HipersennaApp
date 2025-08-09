import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../constants/colors";

export default function Resumo() {
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Confirme os dados
                    </Text>
                </View>
                <LargeButton
                    title="Salvar dados"
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,

    },
    titleContainer:{
        alignItems: "center"
    },
    title:{
        color: colors.blue,
        fontSize: 30,
        fontWeight: "bold",
    },
})