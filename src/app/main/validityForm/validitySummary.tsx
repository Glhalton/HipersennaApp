import { Header } from "@/components/header";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { userDataStore } from "../../../../store/userDataStore";
import { validityInsertStore } from "../../../../store/validityInsertStore";


export default function ValiditySummary() {

    //Lista de itens inseridos do Formulário
    const validityData = validityInsertStore((state) => state.validityData)
    const productsList = validityInsertStore((state) => state.productsList);
    const removeProduct = validityInsertStore((state) => state.removeProduct);
    const resetProducts = validityInsertStore((state) => state.resetProducts);

    //Requisição para inserir validade no banco via API
    const inserirValidade = async () => {

        if (productsList.length === 0) {
            Alert.alert("Atenção", "Nenhum produto para ser adicionado.");
            router.back();
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
                    itens: productsList
                })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                Alert.alert("Sucesso", resultado.mensagem);
                resetProducts();
                router.back();
            } else {
                Alert.alert("Erro", resultado.mensagem)
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possivel conectar ao sevidor: " + erro);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Header
                text="Resumo da vistoria"
                navigationType="back"
            />
            <View style={styles.cardsBox}>

                <View style={styles.filialTitleBox}>
                    <Text style={styles.filialTitleText}>
                        Filial:  {validityData.branchId}
                    </Text>
                </View>

                <FlatList
                    data={productsList}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitleText}>#{index + 1} - {item.description}</Text>
                            <View style={styles.productDataBox}>
                                <View>
                                    <Text style={styles.productDataText}><Text style={styles.label}>Código:</Text> {item.codProduct}</Text>
                                    <Text style={styles.productDataText}><Text style={styles.label}>Validade:</Text> {new Date(item.validityDate).toLocaleDateString("pt-BR")}</Text>
                                </View>
                                <View>
                                    <Text style={styles.productDataText}><Text style={styles.label}>Quantidade:</Text> {item.quantity}</Text>
                                </View>
                            </View>


                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeProduct(index)}
                            >
                                <Text style={styles.removeText}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />

                <View style={styles.insertButton}>
                    <LargeButton
                        text="Salvar dados"
                        onPress={inserirValidade}
                    />
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filialTitleBox: {
        paddingBottom: 20
    },
    filialTitleText: {
        fontFamily: "Lexend-Bold",
        fontSize: 30,
        color: colors.blue,
    },
    cardsBox: {
        paddingHorizontal: 14,
        paddingTop: 10,
        flex: 1,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    cardTitleText: {
        fontSize: 16,
        fontFamily: "Lexend-Bold",
        marginBottom: 6,
        color: colors.blue,

    },
    productDataBox: {
        flexDirection: "row",
        gap: 60,
        marginBottom: 8,
    },
    label: {
        fontFamily: "Lexend-Regular",
        color: colors.blue,
    },
    productDataText:{
        fontFamily: "Lexend-Regular",
        color: colors.gray,
    },
    removeButton: {
        backgroundColor: "#f72929ff",
        padding: 5,
        borderRadius: 7,
        alignItems: "center",
    },
    removeText: {
        color: "white",
        fontFamily: "Lexend-Bold"
    },
    insertButton: {
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 20,
    }
})