import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, TextInput} from "react-native";
import { Header } from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { requestProductsStore } from "../../../../store/requestProductsStore";
import { BlurView } from "expo-blur";
import { SmallButton } from "@/components/smallButton";



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



            </View>
            <Modal
                animationType="fade"
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                {/* <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}> */}
                <View style={styles.modalContainerCenter}>
                    <View style={styles.modalBox}>
                        <View style={styles.productDataBox}>
                            <Text style={styles.label}>Cod. Produto: <Text style={styles.productDataText}>{selectedProduct?.codProduct}</Text></Text>
                            <Text style={styles.label}>Descrição: <Text style={styles.productDataText}>{selectedProduct?.description}</Text></Text>
                            <Text style={styles.label}>Dt. Validade: <Text style={styles.productDataText}>{selectedProduct?.validityDate}</Text></Text>
                            <View style={styles.inputBox}>
                                <Text style={styles.label}>Quant:</Text>
                                <TextInput
                                    style={styles.input}
                                    inputMode="numeric"
                                />
                            </View>

                        </View>
                        <View style={styles.modalButtonsBox}>
                            <SmallButton
                                title={"Não encontrei"}
                                onPress={() => { setModalVisible(false) }}
                            />
                            <SmallButton
                                backgroundColor={colors.gray}
                                title={"Voltar"}
                                onPress={() => setModalVisible(false)}
                            />
                        </View>
                    </View>
                </View>
                {/* </BlurView> */}
            </Modal>
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
        borderRadius: 20,
        backgroundColor: colors.inputColor,
        justifyContent: "center",
        alignItems: "center",
    },
    modalButtonsBox: {
        flexDirection: "row",
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "space-around",
        alignItems: "flex-end",
        paddingVertical: 30,
    },
    productDataBox: {
        paddingTop: 110,
        gap: 6,
        alignItems: "center",

    },
    inputBox:{
        flexDirection: "row",
        
    },
    input: {
        height: 10,
        minHeight: 10,
    }

})