import { Header } from "@/components/header";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { validityInsertStore } from "../../../../store/validityInsertStore";

export default function SelectType() {

    const resetarLista = validityInsertStore((state) => state.resetarLista);

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
                        Selecione o tipo de Vistoria:
                    </Text>
                </View>

                <View>
                    <View style={styles.avulsaButton}>
                        <LargeButton
                            text="Avulsa"
                            onPress={() => router.push("./selectFilialValidity")}
                        />
                    </View>
                    <View style={styles.porSolicitacaoButton}>
                        <LargeButton
                            text="Por solicitação"
                            onPress={() => router.push("./selectRequest")}
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
    formBox: {
        flex: 1,
        marginHorizontal: 14,
        paddingTop: 100,
    },
    titleBox: {
        paddingVertical: 20,
    },
    titleText: {
        fontSize: 30,
        color: colors.blue,
        fontFamily: "Lexend-Bold",
        textAlign: "center",
    },
    avulsaButton: {
        marginBottom: 20,
    },
    porSolicitacaoButton: {

    }
})