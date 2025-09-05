import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Header } from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import { requestProductsStore } from "../../../../store/requestProductsStore";
import colors from "../../../../constants/colors";

export default function RequestProducts() {

    const products = requestProductsStore((state) => state.produtos);

    useEffect(() => {
        console.log(products);
    }, [])

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Header
                text="Produtos da Solicitação"
                navigationType="back"
            />

            <View style={styles.cardsContainer}>

                <FlatList
                    data={products}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <View style={styles.listId}>
                                <Text style={styles.label}>
                                    {index + 1}°
                                </Text>
                            </View>
                            <View style={styles.dadosItem}>
                                <View style={styles.codDescricaoProdutoRow}>
                                    <Text style={styles.label}> {item.codProduct} <Text style={styles.productDataText} > : {item.description}</Text> </Text>

                                </View>
                                <View>
                                    <Text style={styles.label} > Dt. vencimento: <Text style={styles.productDataText}>{item.validityDate.toString()}</Text></Text>
                                </View>
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