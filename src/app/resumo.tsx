import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import colors from "../../constants/colors";
import { DataTable } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router"
import { useVistoriaStore } from "../../store/useVistoriaStore";

export default function Resumo() {
    //Lista de itens inseridos do Formulário
    const lista = useVistoriaStore((state) => state.lista);
    const removeritem = useVistoriaStore((state) => state.removerItem);
    const resetarLista = useVistoriaStore((state) => state.resetarLista);
    const userId = useVistoriaStore((state) => state.userId);
    const nomeProduto = useVistoriaStore((state) => state.nomeProduto);



    //Requisição para inserir validade no banco via API
    const inserirValidade = async () => {
        try {

            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/insercao.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    userId,
                    itens: lista
                })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                Alert.alert("Sucesso", resultado.mensagem);
                resetarLista();
                router.push("/vistoriaFormulario");
            } else {
                Alert.alert("Erro", resultado.mensagem)
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possivel conectar ao sevidor: " + erro);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.tableContainer}>
                <ScrollView horizontal>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={styles.colNumero}>#</DataTable.Title>
                            <DataTable.Title style={styles.colFilial}>Filial</DataTable.Title>
                            <DataTable.Title style={styles.colCodigo}>Código</DataTable.Title>
                            <DataTable.Title style={styles.colDescricao}>Descrição</DataTable.Title>
                            <DataTable.Title style={styles.colDataValidade}>Data Validade</DataTable.Title>
                            <DataTable.Title style={styles.colQuantidade}>Quantidade</DataTable.Title>
                            <DataTable.Title style={styles.colObservacao}>Observação</DataTable.Title>
                            <DataTable.Title style={styles.colAcoes}>Ações</DataTable.Title>

                        </DataTable.Header>

                        {lista.map((item, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.colNumero}>{index + 1}</DataTable.Cell>
                                <DataTable.Cell style={styles.colFilial}>{item.codFilial}</DataTable.Cell>
                                <DataTable.Cell style={styles.colCodigo}>{item.codProd}</DataTable.Cell>
                                <DataTable.Cell style={styles.colDescricao}>{item.nomeProduto}</DataTable.Cell>
                                <DataTable.Cell style={styles.colDataValidade}>{new Date(item.dataVencimento).toLocaleDateString("pt-BR")}</DataTable.Cell>
                                <DataTable.Cell style={styles.colQuantidade}>{item.quantidade}</DataTable.Cell>
                                <DataTable.Cell style={styles.colObservacao}>{item.observacao}</DataTable.Cell>
                                <DataTable.Cell style={styles.colAcoes}>
                                    <TouchableOpacity style={styles.removerButton} onPress={() => removeritem(index)}>
                                        <Text style={styles.removerText}>
                                            Remover
                                        </Text>
                                    </TouchableOpacity>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </ScrollView>
            </View>

            <View style={styles.inserirButton}>
                <LargeButton
                    title="Salvar dados"
                    onPress={inserirValidade}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        paddingTop: 20,

    },
    titleContainer: {
        alignItems: "center",
    },
    title: {
        color: colors.blue,
        fontSize: 30,
        fontWeight: "bold",
    },
    tableContainer: {
        marginBottom: 20
    },

    colNumero: {
        width: 50,
    },
    colFilial: {
        width: 60,
    },
    colCodigo: {
        width: 80,
    },
    colDescricao: {
        width: 350,
    },
    colDataValidade: {
        width: 110,
    },
    colQuantidade: {
        width: 90,
    },
    colObservacao: {
        width: 350,
    },
    colAcoes: {
        width: 120,
        justifyContent: "center",
    },
    removerButton: {
        backgroundColor: "red",
        padding: 5,
        borderRadius: 7
    },
    removerText: {
        color: "white"
    },
    inserirButton: {
        justifyContent: "flex-end",
        flex: 1,
        marginBottom: 100

    }
})