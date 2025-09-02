import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from "react-native";
import { LargeButton } from "@/components/largeButton";
import colors from "../../../../constants/colors";
import { router } from "expo-router"
import { useVistoriaStore } from "../../../../store/useVistoriaStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { useUserDadosStore } from "../../../../store/useUserDadosStore";


export default function ValiditySummary() {

    //Lista de itens inseridos do Formulário
    const lista = useVistoriaStore((state) => state.lista);
    const removeritem = useVistoriaStore((state) => state.removerItem);
    const resetarLista = useVistoriaStore((state) => state.resetarLista);
    const userId = useUserDadosStore((state) => state.userId);
    const codFilial = useVistoriaStore((state) => state.codFilial);

    //Requisição para inserir validade no banco via API
    const inserirValidade = async () => {

        if (lista.length === 0) {
            Alert.alert("Atenção", "Nenhum item para ser adicionado.");
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

                    userId,
                    codFilial,
                    itens: lista
                })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                Alert.alert("Sucesso", resultado.mensagem);
                resetarLista();
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
                        Filial:  {codFilial}
                    </Text>
                </View>

                <FlatList
                    data={lista}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitleText}>#{index + 1} - {item.nomeProduto}</Text>
                            <View style={styles.productDataBox}>
                                <View>
                                    <Text style={styles.productDataText}><Text style={styles.label}>Código:</Text> {item.codProd}</Text>
                                    <Text style={styles.productDataText}><Text style={styles.label}>Validade:</Text> {new Date(item.dataVencimento).toLocaleDateString("pt-BR")}</Text>
                                </View>
                                <View>
                                    <Text style={styles.productDataText}><Text style={styles.label}>Quantidade:</Text> {item.quantidade}</Text>
                                </View>
                            </View>


                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeritem(index)}
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