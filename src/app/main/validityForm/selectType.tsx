
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { validityInsertStore } from "../../../../store/validityInsertStore";

export default function SelectType() {

    const resetarLista = validityInsertStore((state) => state.resetProducts);

    useEffect(() => {
        resetarLista();
        console.log("Resetou a lista")
    }, [])

    return (
        <SafeAreaView style={styles.container}>
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
    avulsaButton: {
        marginBottom: 20,
    },
    porSolicitacaoButton: {

    }
})