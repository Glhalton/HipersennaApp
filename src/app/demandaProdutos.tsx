import { Header } from "@/components/header";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVistoriaProdutoStore } from "../../store/useVistoriaProdutosStore";
import { router } from "expo-router";
import colors from "../../constants/colors";

export default function Historico() {

    const produtos = useVistoriaProdutoStore((state) => state.produtos);
    const nomeProduto = "PRODUTO TESTE NUMERO DEZ MIL";

    useEffect(() => {
        console.log(produtos);
    }, [])

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Header
                title="Demanda"
                navigationType="back"
            />

            <View style={styles.cardsContainer}>

                <View style={styles.header}>
                    <View style={styles.listIdH}>
                        <Text style={styles.textHeader}>
                            #
                        </Text>
                    </View>
                    <View style={styles.prodIdH}>
                        <Text style={styles.textHeader}>
                            Cod.Prod.
                        </Text>
                    </View>
                    <View style={styles.nomeProdutoH}>
                        <Text style={styles.textHeader}>
                            Descrição
                        </Text>
                    </View>
                </View>
                <FlatList
                    data={produtos}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <View style={styles.listId}>
                                <Text style={styles.text}>
                                    {index + 1}
                                </Text>
                            </View>
                            <View style={styles.prodId}>
                                <Text style={styles.text}>
                                    {item.cod_produto}
                                </Text>
                            </View>
                            <View style={styles.nomeProduto}>
                                <Text style={styles.text} >
                                    {nomeProduto}
                                </Text>
                            </View>
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
        paddingVertical: 20,
        paddingHorizontal: 14,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "white",
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: "Lexend-Bold",
        marginBottom: 6,
        color: colors.blue,
    },
    text: {
        fontFamily: "Lexend-Regular"
    },
    textHeader: {
        fontFamily: "Lexend-Regular",
        color: "white",
    },
    dadosItem: {
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "center",
        justifyContent: "space-between"
    },
    listId: {
        paddingVertical: 5,
        paddingLeft: 5,
        width: "10%",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
    },
    prodId: {
        paddingVertical: 5,
        paddingLeft: 5,
        width: "23%",
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    nomeProduto: {
        paddingVertical: 5,
        paddingLeft: 5,
        width: "67%",
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    header: {
        flexDirection: "row",
    },
    listIdH: {
        paddingVertical: 5,
        paddingLeft: 5,
        width: "10%",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        backgroundColor: colors.gray
    },
    prodIdH: {
        paddingVertical: 5,
        paddingLeft: 5,
        width: "23%",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        backgroundColor: colors.gray

    },
    nomeProdutoH: {
        paddingVertical: 5,
        paddingLeft: 5,
        width: "67%",
        borderBottomWidth: 1,
        backgroundColor: colors.gray,
        borderRightWidth: 1,
    },

})