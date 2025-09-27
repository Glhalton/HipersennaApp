import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { employeeDataStore } from "../../../store/employeeDataStore";

export default function Settings() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];


    const name = employeeDataStore((state) => state.name)
    const username = employeeDataStore((state) => state.username)
    const branchId = employeeDataStore((state) => state.branchId)
    const acessLevel = employeeDataStore((state) => state.accessLevel)

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <View style={styles.contentBox}>
                <Text style={[styles.title, { color: theme.title }]}>
                    Dados do Usuário:
                </Text>
                <View style={[styles.userDataBox, { backgroundColor: theme.uiBackground }]}>
                    <Text style={[styles.label, { color: theme.title }]}>Nome: <Text style={[styles.text, { color: theme.text }]}>{name}</Text></Text>
                    <Text style={[styles.label, { color: theme.title }]}>Username: <Text style={[styles.text, { color: theme.text }]}>{username}</Text></Text>
                    <Text style={[styles.label, { color: theme.title }]}>Filial: <Text style={[styles.text, { color: theme.text }]}>{branchId}</Text></Text>
                    <Text style={[styles.label, { color: theme.title }]}>Nivel de Acesso: <Text style={[styles.text, { color: theme.text }]}>{acessLevel}</Text></Text>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentBox: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontFamily: "Lexend-Bold",
        fontSize: 20,
        paddingBottom: 10,
    },
    userDataBox: {
        padding: 20,
        borderRadius: 20,
    },
    label: {
        fontFamily: "Lexend-Bold",
        fontSize: 16,
    },
    text: {
        fontFamily: "Lexend-Regular"
    },
})