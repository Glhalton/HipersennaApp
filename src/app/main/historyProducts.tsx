import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { validitiesEmployeeStore } from "../../../store/validitiesEmployeeStore";

export default function historyProducts() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];


    const products = validitiesEmployeeStore((state) => state.products);

    useEffect(() => {
        console.log(products);
    }, [])

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>

            <View style={styles.cardsContainer}>
                <FlatList
                    data={products}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={[styles.card, { backgroundColor: theme.uiBackground }]}>
                            <View style={styles.listId}>
                                <Text style={[styles.label, { color: theme.title }]}>
                                    {index + 1}°
                                </Text>
                            </View>
                            <View style={styles.dadosItem}>
                                <View style={styles.codDescricaoProdutoRow}>
                                    {/* <Text style={styles.label}> {item.product_cod} <Text style={styles.productDataText} > : {item.description}</Text> </Text> */}
                                    <Text style={[styles.label, { color: theme.title }]}> {item.product_cod}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.label, { color: theme.title }]} > Dt. vencimento: <Text style={[styles.productDataText, { color: theme.text }]}>{item.validity_date.slice(0, 10)}</Text></Text>
                                    <Text style={[styles.label, { color: theme.title }]} > Quantidade: <Text style={[styles.productDataText, { color: theme.text }]}>{item.quantity}</Text></Text> 
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
        borderColor: Colors.gray,
        marginBottom: 10
    },
    codDescricaoProdutoRow: {
        flexDirection: "row"
    },
    productDataText: {
        fontFamily: "Lexend-Regular",
        color: Colors.gray
    },
    label: {
        fontFamily: "Lexend-Bold",
        color: Colors.blue,
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