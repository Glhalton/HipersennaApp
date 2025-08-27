import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { router } from "expo-router";
import { DropdownInput } from "@/components/dropdownInput";
import colors from "../../constants/colors";
import { LargeButton } from "@/components/largeButton";
import { useVistoriaStore } from "../../store/useVistoriaStore";

export default function TipoVistoria() {

    //Codigo da filial

    const resetarLista = useVistoriaStore((state) => state.resetarLista);

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
                        Selecione o tipo de Vistoria:
                    </Text>
                </View>

                <View>
                    <View style={styles.avulsaButton}>
                        <LargeButton
                            title="Avulsa"
                            onPress={() => router.push("/vistoriaFormulario")}
                        />
                    </View>
                    <View style={styles.porSolicitacaoButton}>
                        <LargeButton
                            title="Por solicitação"
                            onPress={() => router.push("/demandasSelecao")}
                        />
                    </View>
                </View>
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
        marginHorizontal: 14,
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
    avulsaButton:{
        marginBottom: 20, 
    }, porSolicitacaoButton:{

    }
})