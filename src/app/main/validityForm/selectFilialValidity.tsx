import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { DropdownInput } from "@/components/dropdownInput";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { validityInsertStore } from "../../../../store/validityInsertStore";
import { userDataStore } from "../../../../store/userDataStore";

export default function SelectFilialValidity() {

    //Codigo da filial

    const resetarLista = validityInsertStore((state) => state.resetProducts);
    const resetValidity = validityInsertStore((state) => state.resetValidity);
    const validity = validityInsertStore((state) => state.validityData);
    const setValidity = validityInsertStore((state) => state.addValidity);
    const userId = userDataStore((state) => state.userId);

    const [branchId, setBranchId] = useState("");

    //Opções do select de filial
    const filiais = [
        { label: "1 - Matriz", value: "1" },
        { label: "2 - Faruk", value: "2" },
        { label: "3 - Carajás", value: "3" },
        { label: "4 - VS10", value: "4" },
        { label: "5 - Xinguara", value: "5" },
        { label: "6 - DP6", value: "6" },
        { label: "7 - Cidade Jardim", value: "7" },
    ];

    function addValidity() {
        if (!branchId || !userId) {
            Alert.alert("Erro!", "Erro na coleta de dados!");
            return;
        }

        const createdAt = new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        });

        setValidity({
            branchId,
            createdAt,
            userId,
            requestId: null,
        })

    }

    useEffect(() => {
        resetarLista();
        resetValidity();
        console.log("Resetou a lista")
    }, [])


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formBox}>
                <View style={styles.titleBox}>
                    <Text style={styles.titleText}>
                        Selecione a filial desejada:
                    </Text>
                </View>

                <View>
                    <DropdownInput
                        label={"Filial:"}
                        value={branchId}
                        items={filiais}
                        onChange={(val) => setBranchId(val)}
                    />
                </View>
                {branchId && (
                    <View style={styles.buttonBox}>
                        <LargeButton
                            text="Continuar"
                            onPress={() => { addValidity(); router.replace("./validityForm"); }}
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
        backgroundColor: colors.white,
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
        color: colors.blue,
        fontFamily: "Lexend-SemiBold",
        textAlign: "center",
    },
    buttonBox: {
        marginTop: 10,
    }
})