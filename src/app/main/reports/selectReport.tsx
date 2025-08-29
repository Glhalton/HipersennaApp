import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LargeButton } from "@/components/largeButton";
import colors from "../../../../constants/colors";
import { router } from "expo-router";

const relatorioVencimento = () => {
    router.push("./relatorioVencimento")
}
const relatorioBonus = () => {
    router.push("./relatorioBonus")
}

export default function SelectReport() {
    return (
        <View style={styles.container}>
            <View>
                <View>
                    <Text style={styles.titulo}>
                        Escolha o tipo de relatório:
                    </Text>
                </View>
                <View style={styles.relatorioVencimentos}>
                    <LargeButton
                        title="Relatório de Vencimentos"
                        onPress={relatorioVencimento}
                    />
                </View>
                <View style={styles.relatorioBonus}>
                    <LargeButton
                        title="Relatório de Bônus"
                        onPress={relatorioBonus}
                        
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        paddingTop: 150,
    },
    titulo:{
        textAlign:"center",
        fontWeight: "bold",
        fontSize: 30,
        color: colors.blue

    },
    relatorioVencimentos: {
        marginTop: 30,
        marginBottom: 30
    },
    relatorioBonus: {

    },
})