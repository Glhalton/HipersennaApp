import { DropdownInput } from "@/components/dropdownInput";
import { Header } from "@/components/header";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { validityInsertStore } from "../../../../store/validityInsertStore";

export default function SelectFilialValidity() {

    //Codigo da filial

    const codFilial = validityInsertStore((state) => state.codFilial);
    const setCodFilial = validityInsertStore((state) => state.setCodFilial);
    const resetarLista = validityInsertStore((state)=> state.resetarLista);

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

    useEffect(() => {
        resetarLista();
        console.log("Resetou a lista")
    }, [])


    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Header
                text="Seleção de Filial"
                navigationType="back"
            />
            <View style={styles.formBox}>
                <View style={styles.titleBox}>
                    <Text style={styles.titleText}>
                        Selecione a filial desejada:
                    </Text>
                </View>

                <View>
                    <DropdownInput
                    label={"Filial:"}
                        value={codFilial}
                        items={filiais}
                        onChange={(val) => setCodFilial(val)}
                    />
                </View>
                {codFilial && (
                    <View style={styles.buttonBox}>
                        <LargeButton
                            text="Continuar"
                            onPress={() => router.push("./validityForm")}
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
        backgroundColor: "white",
    },
    formBox: {
        flex: 1,
        marginHorizontal: 30,
        paddingTop: 100,
    },
    titleBox: {
        paddingVertical: 20,
    },
    titleText: {
        fontSize: 30,
        color: colors.blue,
        fontFamily: "Lexend-Regular",
        textAlign: "center",
    },

    buttonBox:{
        marginTop: 10,
    }
})