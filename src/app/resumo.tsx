import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import colors from "../../constants/colors";
import { DataTable } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router"
import { useVistoriaStore } from "../../store/useVistoriaStore";


const numberOfItemsPerPageList = [5];

export default function Resumo() {
    //Lista de itens inseridos do Formulário
    const lista = useVistoriaStore((state) => state.lista);
    const removeritem = useVistoriaStore((state) => state.removerItem);
    const resetarLista = useVistoriaStore((state) => state.resetarLista);
    const userId = useVistoriaStore((state) => state.userId);
    const nomeProduto = useVistoriaStore((state) => state.nomeProduto);

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(numberOfItemsPerPageList[0]);
    const from = page * numberOfItemsPerPage;
    const to = Math.min((page + 1) * numberOfItemsPerPage, lista.length);

    useEffect(() => {
        setPage(0);
    }, [numberOfItemsPerPage]);


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
                <ScrollView horizontal style={{ height: "60%" }}>
                    <DataTable>
                        <DataTable.Header style={styles.headerTable}>
                            <DataTable.Title style={styles.colNumero}><Text style={styles.textHeader}>#</Text></DataTable.Title>
                            <DataTable.Title style={styles.colFilial}><Text style={styles.textHeader}>Filial</Text></DataTable.Title>
                            <DataTable.Title style={styles.colCodigo}><Text style={styles.textHeader}>Código</Text></DataTable.Title>
                            <DataTable.Title style={styles.colDescricao}><Text style={styles.textHeader}>Descrição</Text></DataTable.Title>
                            <DataTable.Title style={styles.colDataValidade}><Text style={styles.textHeader}>Data Validade</Text></DataTable.Title>
                            <DataTable.Title style={styles.colQuantidade}><Text style={styles.textHeader}>Quantidade</Text></DataTable.Title>
                            <DataTable.Title style={styles.colObservacao}><Text style={styles.textHeader}>Observação</Text></DataTable.Title>
                            <DataTable.Title style={styles.colAcoes}><Text style={styles.textHeader}>Ações</Text></DataTable.Title>

                        </DataTable.Header>

                        {lista.slice(from, to).map((item, index) => (
                            <DataTable.Row key={from + index}>
                                <DataTable.Cell style={styles.colNumero}><Text style={styles.textcell}>{from + index + 1}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.colFilial}><Text style={styles.textcell}>{item.codFilial}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.colCodigo}><Text style={styles.textcell}>{item.codProd}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.colDescricao}><Text style={styles.textcell}>{item.nomeProduto}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.colDataValidade}><Text style={styles.textcell}>{new Date(item.dataVencimento).toLocaleDateString("pt-BR")}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.colQuantidade}><Text style={styles.textcell}>{item.quantidade}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.colObservacao}><Text style={styles.textcell}>{item.observacao}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.colAcoes}>
                                    <TouchableOpacity style={styles.removerButton} onPress={() => removeritem(from + index)}>
                                        <Text style={styles.removerText}>
                                            Remover
                                        </Text>
                                    </TouchableOpacity>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}


                    </DataTable>

                </ScrollView>

                <DataTable.Pagination
                    style={{backgroundColor: colors.blue, justifyContent: "center"}}
                    paginationControlRippleColor= "black"
                    selectPageDropdownRippleColor= "black"
                    page={page}
                    numberOfPages={Math.ceil(lista.length / numberOfItemsPerPage)}
                    onPageChange={setPage}
                    label={`${from + 1}-${to} de ${lista.length}`}
                    showFastPaginationControls
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={numberOfItemsPerPage}
                    onItemsPerPageChange={(newPerPage) => {
                        if (newPerPage) setNumberOfItemsPerPage(newPerPage);
                    }}
                    selectPageDropdownLabel={'Itens por página'}
                />
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
    headerTable: {
        backgroundColor: colors.blue,

    },
    textHeader: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },
    textcell: {
        fontSize: 14,
        color: "black"
    },
    pagination: {
        color: "black",

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