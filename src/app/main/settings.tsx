import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { employeeDataStore } from "../../../store/employeeDataStore";

export default function Settings() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const name = employeeDataStore((state) => {state.name})
    const username = employeeDataStore((state) => {state.username})
    

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <View style={styles.contentBox}>
                <Text style={[styles.title, { color: theme.title }]}>
                    Dados do Usuário:
                </Text>
                <View style={[styles.userData, {backgroundColor: theme.uiBackground}]}>
                    <Text style={[styles.label, { color: theme.title }]}>
                        Nome:
                    </Text>
                    <Text style={[styles.label, { color: theme.title }]}>
                        Username:
                    </Text>
                    <Text style={[styles.label, { color: theme.title }]}>
                        Filial:
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userData: {
        padding: 20
    },
    contentBox: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontFamily: "Lexend-Bold",
        fontSize: 20
    },
    label: {
        fontFamily: "Lexend-Regular"
    }
})