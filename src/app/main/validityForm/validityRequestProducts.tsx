import React, { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { requestProductsStore } from "../../../../store/requestProductsStore";
import { SmallButton } from "@/components/smallButton";
import { validityInsertStore } from "../../../../store/validityInsertStore";
import { validityRequestProductsStore } from "../../../../store/validityRequestProductsStore";
import { LargeButton } from "@/components/largeButton";
import { router, useNavigation } from "expo-router";
import ModalPopup from "@/components/modalPopup";

export default function ValidityRequestProducts() {

    const productList = validityInsertStore((state) => state.productsList);
    const resetProducts = validityInsertStore((state) => state.resetProducts);

    const updateQuantity = validityInsertStore((state) => state.updateProductQuantity)
    const updateStatus = validityInsertStore((state) => state.updateProductStatus)

    const validityData = validityInsertStore((state) => state.validityData);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [quantity, setQuantity] = useState("");
    const [index, setIndex] = useState<any>("");

    const navigation = useNavigation();

    const [showExitModal, setShowExitModal] = useState(false);
    const [exitAction, setExitAction] = useState<any>(null);

    const hasEmpty = productList.some(p => !p.quantity || p.quantity.trim() === "")

    //Função para abrir o modal
    const ProductPress = (item: any, index: number) => {
        setSelectedProduct(item);
        setIndex(index)
        setModalVisible(true);

    }

    //Botão de voltar o modal
    const backButtonModal = ((quant: string) => {
        if (quantity) {
            updateQuantity(index, quant);
            updateStatus(index, "1");

        }
        setModalVisible(false);
        setQuantity("")
    })

    const notFoundButtonModal = (() => {
        updateStatus(index, "3");
        setModalVisible(false);
        updateQuantity(index, "0");
        setQuantity("");
    })

    function getColor(status: string | undefined) {
        if (status === "1") return "#5FE664";
        if (status === "3") return colors.red2;
        return "white";
    }

    function getColorText(status: string | undefined) {
        if (status === "3") return "white";
        return colors.blue;
    }

    useEffect(() => {
        console.log(validityData)
    }, [])

    //Função para capturar o botão de voltar
    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            e.preventDefault(); // bloqueia a navegação
            setExitAction(e.data.action); // salva a ação para executar depois
            setShowExitModal(true); // mostra o modal personalizado
        });

        return unsubscribe;
    }, [navigation]);

    const handleConfirmExit = () => {
        setShowExitModal(false);
        if (exitAction) {
            navigation.dispatch(exitAction); // executa a navegação original
        }
    };

    const handleCancelExit = () => {
        setShowExitModal(false);
        setExitAction(null);
    };

    //Requisição para inserir validade no banco via API
    const insertValidity = async () => {

        if (productList.length === 0) {
            Alert.alert("Atenção", "Nenhum produto para ser adicionado.");
            router.replace("/main/validityForm/selectType");
            return;
        }

        try {

            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/insercaoValidade.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    validity: validityData,
                    itens: productList
                })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                Alert.alert("Sucesso", resultado.mensagem);
                resetProducts();
                router.replace("/main/validityForm/selectType");
            } else {
                Alert.alert("Erro", resultado.mensagem)
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possivel conectar ao sevidor: " + erro);
        }
    };


    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <View style={styles.cardsContainer}>
                <View style={styles.titleBox}>
                    <Text style={styles.titleText}>
                        Digite a quantidade para cada produto:
                    </Text>
                </View>

                <FlatList
                    data={productList}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => { ProductPress(item, index); console.log(item); }}
                        >
                            <View style={[styles.card, { backgroundColor: getColor(item.productStatus) }]}>
                                <View style={styles.listId}>
                                    <Text style={[styles.label, { color: getColorText(item.productStatus) }]}>
                                        {index + 1}°
                                    </Text>
                                </View>
                                <View>
                                    <View style={styles.codDescricaoProdutoRow}>
                                        <Text style={[styles.label, { color: getColorText(item.productStatus) }]}> {item.codProduct}: <Text style={[styles.productDataText, { color: getColorText(item.productStatus) }]}>{item.description}</Text> </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.label, { color: getColorText(item.productStatus) }]} > Dt. vencimento: <Text style={[styles.productDataText, { color: getColorText(item.productStatus) }]}>{item.validityDate.toString()}</Text></Text>
                                    </View>
                                </View>
                                <View style={styles.dadosItem}>
                                    <View style={styles.codDescricaoProdutoRow}>
                                        <Text style={[styles.label, { color: getColorText(item.productStatus) }]}> Quant: </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.productDataText, { color: getColorText(item.productStatus) }]}> {item.quantity} </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                {!hasEmpty && (
                    <View>
                        <LargeButton
                            text="Finalizar validade"
                            onPress={insertValidity}
                        />
                    </View>
                )}



            </View>

            <ModalPopup
                visible={showExitModal}
                onRequestClose={handleCancelExit}
                buttonLeft={handleCancelExit}
                buttonRight={handleConfirmExit}
            />

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
                                    value={quantity}
                                    onChangeText={setQuantity}

                                />
                            </View>

                        </View>
                        <View style={styles.modalButtonsBox}>
                            <SmallButton
                                title={"Não encontrei"}
                                onPress={() => { notFoundButtonModal() }}

                            />
                            <SmallButton
                                backgroundColor={"#13BE19"}
                                title={"Confirmar"}
                                onPress={() => backButtonModal(quantity)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,

    },
    titleBox: {
        alignItems: "center",
        paddingBottom: 20
    },
    titleText: {
        fontFamily: "Lexend-SemiBold",
        color: colors.blue,
        fontSize: 25
    },
    cardsContainer: {
        paddingVertical: 20,
        paddingHorizontal: 14,
    },
    card: {
        flexDirection: "row",
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

        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        backgroundColor: "rgba(0, 0, 0, 0.53)",
    },
    modalBox: {
        width: "100%",
        height: 300,
        borderRadius: 20,
        backgroundColor: "white",
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
        paddingTop: 60,
        gap: 6,
        alignItems: "center",

    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20

    },
    input: {
        height: 40,
        minHeight: 10,
        width: 100,
        backgroundColor: colors.inputColor,
        borderRadius: 20,
        borderWidth: 1,
        paddingLeft: 20
    }

})