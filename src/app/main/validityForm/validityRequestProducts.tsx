import { Header } from "@/components/header";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ValidityRequestProducts() {

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Header
                text="Vistoria dos produtos"
                navigationType="back"
            />
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})