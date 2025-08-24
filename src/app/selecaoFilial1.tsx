import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { router } from "expo-router";
import { DropdownInput } from "@/components/dropdownInput";
import colors from "../../constants/colors";
import { LargeButton } from "@/components/largeButton";
import { useVistoriaStore } from "../../store/useVistoriaStore";

export default function SelecaoFilial1() {

    //Codigo da filial

    const codFilial = useVistoriaStore((state) => state.codFilial);
    const setCodFilial = useVistoriaStore((state) => state.setCodFilial);
    const resetarLista = useVistoriaStore((state)=> state.resetarLista);

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
                title="Seleção de Filial"
                navigationType="back"
            />
            <View style={styles.formulario}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Selecione a filial desejada:
                    </Text>
                </View>

                <View>
                    <Text style={styles.label}>
                        Filial:
                    </Text>
                    <DropdownInput
                        value={codFilial}
                        items={filiais}
                        onChange={(val) => setCodFilial(val)}
                    />
                </View>
                {codFilial && (
                    <View style={styles.buttonContainer}>
                        <LargeButton
                            title="Continuar"
                            onPress={() => router.push("/vistoriaFormulario")}
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
    formulario: {
        flex: 1,
        marginHorizontal: 30,
        paddingTop: 100,
        
    },
    titleContainer: {
        paddingVertical: 20,
    },
    title: {
        fontSize: 30,
        color: colors.blue,
        fontFamily: "Lexend-Regular",
        textAlign: "center",
    },
    label: {
        color: colors.blue,
        marginBottom: 4,
        fontFamily: "Lexend-Bold",
    },
    buttonContainer:{
        
    }
})