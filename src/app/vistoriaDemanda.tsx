import { Header } from "@/components/header";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VistoriaDemanda() {
    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Header
                title="Demandas"
                screen="/home"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
})