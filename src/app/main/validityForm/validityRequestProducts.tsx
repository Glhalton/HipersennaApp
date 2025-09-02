import { Header } from "@/components/header";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelectedRequestsStore } from "../../../../store/useSelectedsRequestsStore";
import { router } from "expo-router";
import colors from "../../../../constants/colors";

export default function validityRequestProducts() {

    const requests = useSelectedRequestsStore((state) => state.lista);

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Header
                text="Produtos da Solicitação"
                navigationType="back"
            />

            <View style={styles.cardsContainer}>

                <FlatList
                    data={requests.products}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <View style={styles.listId}>
                                <Text style={styles.label}>{index + 1}°</Text>
                            </View>
                            <View style={styles.dadosItem}>
                                {/* FlatList de produtos */}
                                <FlatList
                                    data={item.products}
                                    keyExtractor={(_, i) => i.toString()}
                                    renderItem={({ item: produto }) => (
                                        <View style={{ marginBottom: 5 }}>
                                            <View style={styles.codDescricaoProdutoRow}>
                                                <Text style={styles.label}>
                                                    {produto.productCode}{" "}
                                                    <Text style={styles.productDataText}>
                                                        : {produto.description}
                                                    </Text>
                                                </Text>
                                            </View>
                                            <Text style={styles.label}>
                                                Dt. vencimento:{" "}
                                                <Text style={styles.productDataText}>
                                                    {produto.validityDate}
                                                </Text>
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    )}
                />

            </View>

        </SafeAreaView >
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
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.gray,
        marginBottom: 10
    },
    codDescricaoProdutoRow: {
        flexDirection: "row"
    },
    productDataText: {
        fontFamily: "Lexend-Regular",
        color: colors.gray
    },
    label: {
        fontFamily: "Lexend-Bold",
        color: colors.blue,
    },
    textHeader: {
        fontFamily: "Lexend-Regular",
        color: "white",
    },
    dadosItem: {
        paddingVertical: 10
    },
    listId: {
        padding: 10
    }
})