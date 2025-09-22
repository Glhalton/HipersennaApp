import { DropdownInput } from "@/components/dropdownInput";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { employeeDataStore } from "../../../../store/employeeDataStore";
import { postValidityDataStore } from "../../../../store/postValidityDataStore";

export default function SelectFilialValidity() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const userId = employeeDataStore((state) => state.userId);
    const setValidity = postValidityDataStore((state) => state.addValidity);
    const resetValidity = postValidityDataStore((state) => state.resetValidityData);
    const resetList = postValidityDataStore((state) => state.resetProductsList);

    const [branchId, setBranchId] = useState("");
    const branches = [
        { label: "1 - Matriz", value: "1" },
        { label: "2 - Faruk", value: "2" },
        { label: "3 - Carajás", value: "3" },
        { label: "4 - VS10", value: "4" },
        { label: "5 - Xinguara", value: "5" },
        { label: "6 - DP6", value: "6" },
        { label: "7 - Cidade Jardim", value: "7" },
    ];

    //Cria a validade com request = null, pois é avulsa
    function addValidity() {
        if (!branchId || !userId) {
            Alert.alert("Erro!", "Erro na coleta de dados!");
            return;
        }

        setValidity({
            branch_id : Number(branchId),
            employee_id : userId,
            request_id: null,
        })

    }

    useEffect(() => {
        resetList();
        resetValidity();
    }, [])

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
            <View style={styles.formBox}>
                <View style={styles.titleBox}>
                    <Text style={[styles.titleText, {color: theme.title}]}>
                        Selecione a filial desejada:
                    </Text>
                </View>

                <View>
                    <DropdownInput
                        label={"Filial:"}
                        value={branchId}
                        items={branches}
                        onChange={(val) => setBranchId(val)}
                    />
                </View>
                {branchId && (
                    <View style={styles.buttonBox}>
                        <LargeButton
                            text="Continuar"
                            onPress={() => { addValidity(); router.replace("./validityForm"); }}
                            backgroundColor={theme.red}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    formBox: {
        flex: 1,
        marginHorizontal: 20,
    },
    titleBox: {
        paddingVertical: 20,
    },
    titleText: {
        fontSize: 30,
        color: Colors.blue,
        fontFamily: "Lexend-SemiBold",
        textAlign: "center",
    },
    buttonBox: {
        marginTop: 10,
    }
})