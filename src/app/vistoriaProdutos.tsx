import { Header } from "@/components/header";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVistoriaProdutoStore } from "../../store/useVistoriaProdutosStore";
import { router } from "expo-router";
import colors from "../../constants/colors";

export default function Historico() {

    const produtos = useVistoriaProdutoStore((state) => state.produtos)

    useEffect(() => {
        console.log(produtos);
    }, [])

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Header
                title="Demanda"
                screen="/vistoriaDemanda"
            />

            <View style={styles.cardsContainer}>

                <FlatList
                    data={produtos}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                #{index + 1} - {item.cod_produto}
                            </Text>
                            {/* <View style={styles.dadosItem}>
                                <View>
                                    <Text><Text style={styles.label}>Filial:</Text> {item.cod_filial}</Text>
                                    <Text><Text style={styles.label}>Criado em:</Text> {new Date(item.dataSolicitacao).toLocaleDateString("pt-BR")}</Text>
                                    <Text><Text style={styles.label}>Status:</Text> {item.status}</Text>
                                </View>
                                <View style={styles.containerButton}>
                                    <TouchableOpacity
                                        style={styles.buttonVerMais}
                                        onPress={() => { router.push("/vistoriaProdutos"); setProdutos(item.produtos); }}
                                    >
                                        <Image
                                            style={styles.verMaisIcon}
                                            source={require("../../assets/images/Vector-2x.png")}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                        </View>
                    )}
                />

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    cardsContainer: {
        paddingVertical: 20
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: "Lexend-Bold",
        marginBottom: 6,
        color: colors.blue,

    },
    label: {
        fontFamily: "Lexend-Regular",
        color: colors.blue,
    },
    dadosItem: {
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "center",
        justifyContent: "space-between"
    },
})