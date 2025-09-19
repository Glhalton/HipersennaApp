import { LargeButton } from "@/components/largeButton";
import ModalPopup from "@/components/modalPopup";
import { SmallButton } from "@/components/smallButton";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { validityInsertStore } from "../../../../store/validityInsertStore";

export default function ValidityRequestProducts() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const productsList = validityInsertStore((state) => state.productsList) || [];
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

    const hasEmpty = productsList.some(p => !p.quantity || p.quantity === null)

    //Função para abrir o modal
    const ProductPress = (item: any, index: number) => {
        setSelectedProduct(item);
        setIndex(index)
        setModalVisible(true);

    }

    //Botão de voltar o modal
    const backButtonModal = ((quant: string) => {
        if (quantity) {
            updateQuantity(index, Number(quant));
            updateStatus(index, "1");

        }
        setModalVisible(false);
        setQuantity("")
    })

    const notFoundButtonModal = (() => {
        updateStatus(index, "3");
        setModalVisible(false);
        updateQuantity(index, 0);
        setQuantity("");
    })

    function getColor(status: string | undefined) {
        if (status === "1") return "#5FE664";
        if (status === "3") return Colors.red2;
        return theme.uiBackground;
    }

    function getColorText(status: string | undefined) {
        if (status === "3") return "white";
        if (status === "1") return Colors.blue;
        return theme.text;
    }

    useEffect(() => {
        console.log(validityData)
        console.log(productsList)
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

    // //Requisição para inserir validade no banco via API
    // const insertValidity = async () => {

    //     if (productsList.length === 0) {
    //         Alert.alert("Atenção", "Nenhum produto para ser adicionado.");
    //         router.replace("/main/validityForm/selectType");
    //         return;
    //     }

    //     try {

    //         const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/insercaoValidade.php", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 validity: validityData,
    //                 itens: productsList
    //             })
    //         });

    //         const resultado = await resposta.json();

    //         if (resultado.sucesso) {
    //             Alert.alert("Sucesso", resultado.mensagem);
    //             resetProducts();
    //             router.replace("/main/validityForm/selectType");
    //         } else {
    //             Alert.alert("Erro", resultado.mensagem)
    //         }
    //     } catch (erro) {
    //         Alert.alert("Erro", "Não foi possivel conectar ao sevidor: " + erro);
    //     }
    // };

    const postValidity = async () => {

        if (productsList.length === 0) {
            Alert.alert("Atenção", "Nenhum produto para ser adicionado.");
            router.back();
            return;
        }



        try {

            const response = await fetch("http://10.101.2.7:3333/validities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    validity: validityData,
                    products: productsList
                })
            });



            const responseData = await response.json();

            if (responseData.createdValidity) {
                Alert.alert("Sucesso", responseData.mensagem);
                resetProducts();
                router.replace("/main/home");
            } else {
                Alert.alert("Erro no Servidor", responseData.error)
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possivel conectar ao sevidor: " + erro);
        }
    };



    const formatDate = (dateString: string) => {
        const date = new Date(dateString); // transforma a string em objeto Date
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // mês começa em 0
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };


    return (
        <SafeAreaView edges={["bottom"]} style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.cardsContainer}>
                <View style={styles.titleBox}>
                    <Text style={[styles.titleText, { color: theme.title }]}>
                        Digite a quantidade para cada produto:
                    </Text>
                </View>

                <FlatList
                    data={productsList}
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
                                        <Text style={[styles.label, { color: getColorText(item.productStatus) }]}> {item.product_cod}: <Text style={[styles.productDataText, { color: getColorText(item.productStatus) }]}>{item.description}</Text> </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.label, { color: getColorText(item.productStatus) }]} > Dt. vencimento: <Text style={[styles.productDataText, { color: getColorText(item.productStatus) }]}>{formatDate(item.validity_date)}</Text></Text>
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
                            onPress={postValidity}
                            backgroundColor={theme.red}
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
                    <View style={[styles.modalBox, { backgroundColor: theme.uiBackground }]}>
                        <View style={styles.productDataBox}>
                            <Text style={[styles.labelModal, { color: theme.title }]}>Cod. Produto: <Text style={[styles.productDataText, { color: theme.text }]}>{selectedProduct?.product_cod}</Text></Text>
                            <Text style={[styles.labelModal, { color: theme.title }]}>Descrição: <Text style={[styles.productDataText, { color: theme.text }]}>{selectedProduct?.description}</Text></Text>
                            <Text style={[styles.labelModal, { color: theme.title }]}>Dt. Validade: <Text style={[styles.productDataText, { color: theme.text }]}>{formatDate(selectedProduct?.validity_date)}</Text></Text>
                            <View style={styles.inputBox}>
                                <Text style={[styles.labelModal, { color: theme.title }]}>Quant:</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.inputColor, borderColor: theme.iconColor, color: theme.title }]}
                                    inputMode="numeric"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                />
                            </View>

                        </View>
                        <View style={styles.modalButtonsBox}>
                            <LargeButton
                                text={"Não encontrei"}
                                onPress={() => { notFoundButtonModal() }}

                            />
                            <LargeButton
                                backgroundColor={"#13BE19"}
                                text={"Confirmar"}
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
        backgroundColor: Colors.background,

    },
    titleBox: {
        alignItems: "center",
        paddingBottom: 20
    },
    titleText: {
        fontFamily: "Lexend-SemiBold",
        color: Colors.blue,
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
        borderColor: Colors.gray,
        marginBottom: 10,
        padding: 10,

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
    labelModal: {
        fontFamily: "Lexend-Bold",
        fontSize: 16,
        color: Colors.blue,
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
        height: 330,
        borderRadius: 20,
        backgroundColor: "white",
        paddingVertical: 50,
        paddingHorizontal: 30,
        gap: 20
    },
    productDataBox: {
        width: "100%",
        gap: 4,
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
        backgroundColor: Colors.inputColor,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomWidth: 1,
        paddingLeft: 20,
        fontSize: 18,
        padding: 0,
        margin: 0,
        borderWidth: 0,
        fontFamily: "Lexend-Regular"
    },
    modalButtonsBox: {

        width: "100%",
        gap: 8,
    },

})