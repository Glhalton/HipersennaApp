import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Header } from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { requestProductsStore } from "../../../../store/requestProductsStore";
import { BlurView } from "expo-blur";

export default function ValidityRequestProducts() {

    const produtos = requestProductsStore((state) => state.produtos);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const ProductPress = (item: any) => {
        setSelectedProduct(item);
        setModalVisible(true);
    }

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Header
                text="Produtos da Solicitação"
                navigationType="back"
            />

            <View style={styles.cardsContainer}>

                <FlatList
                    data={produtos}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => ProductPress(item)}
                        >
                            <View style={styles.card}>
                                <View style={styles.listId}>
                                    <Text style={styles.label}>
                                        {index + 1}°
                                    </Text>
                                </View>
                                <View>
                                    <View style={styles.codDescricaoProdutoRow}>
                                        <Text style={styles.label}> {item.codProduct}: <Text style={styles.productDataText}>{item.description}</Text> </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.label} > Dt. vencimento: <Text style={styles.productDataText}>{item.validityDate}</Text></Text>
                                    </View>
                                </View>
                                <View style={styles.dadosItem}>
                                    <View style={styles.codDescricaoProdutoRow}>
                                        <Text style={styles.label}> Quant: </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.productDataText}> 10 </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                <Modal

                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>

                        <View style={styles.modalContainerCenter}>
                            <View style={styles.modalBox}>
                                <Text>
                                    Você clicou em um produto
                                </Text>
                            </View>
                        </View>
                        </BlurView>
                </Modal>

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
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.gray,
        marginBottom: 10,
        padding: 10,

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
        alignItems: "center"
    },
    listId: {
        padding: 10
    },
    modalContainerCenter: {
        opacity: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    modalBox: {
        width: "100%",
        height: 340,
        backgroundColor: "blue"

    }
})