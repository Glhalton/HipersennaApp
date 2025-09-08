import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { userDataStore } from "../../../../store/userDataStore";
import { validityRequestProductsStore } from "../../../../store/validityRequestProductsStore";
import { validityInsertStore } from "../../../../store/validityInsertStore";
import { Octicons } from "@expo/vector-icons";

export default function SelectRequest() {

    const requests = validityRequestProductsStore((state) => state.requests);
    const setRequests = validityRequestProductsStore((state) => state.setLista);
    const userId = userDataStore((state) => state.userId);
    const setProductsList = validityInsertStore((state) => state.setProductList);
    const setValidity = validityInsertStore((state) => state.addValidity);

    //Consulta as solicitações
    const consultarSolicitacoes = async () => {
        try {
            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/consultarSolicitacao.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                setRequests(resultado.solicitacoes);
            } else {
                Alert.alert("Erro", resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possível conectar ao servidor: " + erro);
        }
    };

    //Cria a validade
    function addValidity(branchId: string, requestId: number) {
        if (!branchId || !userId) {
            Alert.alert("Erro!", "Erro na coleta de dados!");
            return;
        }

        const createdAt = new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        });

        setValidity({
            branchId,
            createdAt,
            userId,
            requestId,
        })
    }

    //Define a cor de acordo com o status
    function getColor(status: string | null) {
        if (status === "pendente") return "#FF6200";
        if (status === "em andamento") return "#51ABFF";
        if (status === "concluido") return "#13BE19";
        if (status === "expirado") return "#E80000";
        return "black";
    }

    //Cria a validade e copia os produtos para uma lista
    const selectedRequest = (item: any) => {
        router.replace("../validityForm/validityRequestProducts");
        setProductsList(item.products);
        addValidity(item.branchId.toString(), item.requestId);
    }

    useEffect(() => {
        consultarSolicitacoes();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.contentBox}>

                <View style={styles.titleBox}>
                    <Text style={styles.titleText}>
                        Selecione uma solicitação:
                    </Text>
                </View>
                <View style={styles.filterBox}>
                    <Text style={styles.filterText}>
                        Ordernar Por:
                    </Text>
                </View>

                <View style={styles.flatListBox}>

                    <FlatList
                        data={requests}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => { selectedRequest(item); }}
                            >
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>
                                        #{item.requestId}
                                    </Text>
                                    <View style={styles.requestDataBox}>
                                        <View>
                                            <Text style={styles.text}><Text style={styles.label}>Filial:</Text> {item.branchId}</Text>
                                            <View style={styles.dates}>
                                                <Text style={styles.text}><Text style={styles.label}>Dt. Criação:</Text> {new Date(item.createdAt).toLocaleDateString("pt-BR")}</Text>
                                                <Text style={styles.text}><Text style={styles.label}>Dt. Limite:</Text> {new Date(item.targetDate).toLocaleDateString("pt-BR")}</Text>
                                            </View>
                                            <View style={styles.statusBox}>
                                                <Text style={styles.label}>
                                                    Status:
                                                </Text>
                                                <View style={[styles.dotView, { backgroundColor: getColor(item.status) }]}></View>
                                                <Text style={[styles.statusText, { color: getColor(item.status) }]}>
                                                    {item.status}
                                                </Text>
                                            </View>

                                        </View>

                                        <View style={styles.iconBox}>
                                            <Octicons
                                                name="chevron-right"
                                                size={40}
                                                color={colors.gray}
                                            />
                                        </View>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    contentBox: {
        paddingHorizontal: 14,
        flex: 1,
    },
    titleBox: {
        paddingVertical: 10,
    },
    titleText: {
        fontFamily: "Lexend-SemiBold",
        color: colors.blue,
        fontSize: 25
    },
    filterBox: {
        backgroundColor: colors.gray,
        height: 30,
        width: 140,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    filterText: {
        fontFamily: "Lexend-Regular",
        color: "white"
    },
    flatListBox: {
        paddingBottom: 110,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 14,
        marginBottom: 15,
        borderColor: colors.gray,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: "Lexend-Bold",
        color: colors.blue,
    },
    label: {
        fontFamily: "Lexend-Bold",
        color: colors.blue,
    },
    text: {
        color: colors.gray,
        fontFamily: "Lexend-Regular"
    },
    requestDataBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    dates: {

    },
    statusBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    statusText: {
        fontFamily: "Lexend-Regular"
    },
    dotView: {
        borderRadius: 50,
        width: 13,
        height: 13,
    },
    iconBox: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },

})