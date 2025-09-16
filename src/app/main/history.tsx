import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {

    const [dataVencimento, setDataVencimento] = useState(new Date());

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})