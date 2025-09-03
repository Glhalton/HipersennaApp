import { Header } from "@/components/header";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { requestsInsertStore } from "../../../../store/requestsInsertStore";
import { userDataStore } from "../../../../store/userDataStore";

export default function RequestSummary() {

    //Lista de itens inseridos do Formulário
    const lista = requestsInsertStore((state) => state.lista);
    const removeritem = requestsInsertStore((state) => state.removerItem);
    const resetarLista = requestsInsertStore((state) => state.resetarLista);
    const userId = userDataStore((state) => state.userId);

    const codFilial = requestsInsertStore((state) => state.codFilial);
    const codConferente = requestsInsertStore((state) => state.codConferente);

    //Requisição para inserir validade no banco via API
    const inserirValidade = async () => {

        if (lista.length === 0) {
            Alert.alert("Atenção", "Nenhum item para ser adicionado.");
            router.back();
            return;
        }

        try {

            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/insercaoSolicitacao.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    userId,
                    codFilial,
                    codConferente,
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
                text="Resumo da Solicitação"
                navigationType="back"
            />

            <View style={styles.cardsContainer}>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>
                        Filial: {codFilial}
                    </Text>
                    <Text style={styles.titleText}>
                        Conferente: {codConferente}
                    </Text>
                </View>

                <FlatList
                    data={lista}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>#{index + 1} - {item.nomeProduto}</Text>
                            <View style={styles.dadosItem}>
                                <View>
                                    <Text><Text style={styles.label}>Código:</Text> {item.codProd}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.removerButton}
                                onPress={() => removeritem(index)}
                            >
                                <Text style={styles.removerText}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />


                <View style={styles.inserirButton}>
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
    cardsContainer: {
        paddingHorizontal: 14,
        flex: 1,
    },
    titleContainer: {
        paddingVertical: 20
    },
    titleText: {
        fontFamily: "Lexend-Bold",
        fontSize: 28,
        color: colors.blue,

    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: "Lexend-Bold",
        marginBottom: 6,
        color: colors.blue,

    },
    label: {
        fontFamily: "Lexend-Regular",
        color: colors.blue,
    },
    dadosItem: {
        flexDirection: "row",
        gap: 60,
        marginBottom: 8,
    },
    removerButton: {
        backgroundColor: "#f72929ff",
        padding: 5,
        borderRadius: 7,
        alignItems: "center",
    },
    removerText: {
        color: "white",
        fontFamily: "Lexend-Bold"
    },
    inserirButton: {
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 20,
    }
})