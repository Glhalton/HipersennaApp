import { DateInput } from "@/components/dateInput";
import { Input } from "@/components/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import colors from "../../constants/colors";
import { DropdownInput } from "@/components/dropdownInput";
import { LargeButton } from "@/components/largeButton";
import { DataTable } from "react-native-paper";

export default function VistoriaFormulario() {

    type FormDataItem = {
        codProd: string;
        codFilial: string;
        dataVencimento: Date;
        quantidade: string;
        observacao: string;
    }

    //Id do usuario
    const [userId, setUserId] = useState<string | null>(null);

    //Codigo da filial
    const [codFilial, setCodFilial] = React.useState<string | null>(null);;

    const filiais = [
        { label: "Matriz", value: "1" },
        { label: "Faruk", value: "2" },
        { label: "Carajás", value: "3" },
        { label: "VS10", value: "4" },
        { label: "Xinguara", value: "5" },
        { label: "Cidade Jardim", value: "7" },
    ];

    //Codigo do produto
    const [codProd, setCodProd] = useState("");

    //Nome do produto
    const [nomeProduto, setNomeProduto] = useState<{ descricao: string } | null>(null);

    //Timer para consulta do produto
    const [timer, setTimer] = useState<number | null>(null);

    //Data de Vencimento
    const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined);

    //Quantidade
    const [quantidade, setQuantidade] = useState("");

    //Texto de observacao
    const [observacao, setObservacao] = useState("");

    //Lista de items do Formulario
    const [lista, setLista] = useState<FormDataItem[]>([]);

    //Função para adicionar item do formulario na lista
    const adicionarItem = () => {
        if (!codProd || !codFilial || !dataVencimento || !quantidade) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios!")
            return;
        }

        setLista([...lista, { codProd, codFilial, dataVencimento, quantidade, observacao }]);
        setCodProd("");
        setCodFilial("");
        setDataVencimento(undefined);
        setQuantidade("");
        setObservacao("");

    }

    const goToResumo = () => {
        router.navigate("/resumo");
    }

    const pegarUserId = async () => {
        try {
            const id = await AsyncStorage.getItem("@user_id");
            if (id !== null) {
                setUserId(id);
            }
        } catch (e) {
            console.error("Erro ao recuperar userId", e);
        }
        return null;
    }

    useEffect(() => {
        pegarUserId();
    }, []);


    const inserirValidade = async () => {
        try {

            if (!dataVencimento || isNaN(dataVencimento.getTime())) {
                Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
                return;
            }

            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/insercao.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codFilial,
                    codProd,
                    dataVencimento,
                    quantidade,
                    observacao,
                    userId
                })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                Alert.alert("Sucesso", resultado.mensagem);
                router.push("/home")
            } else {
                Alert.alert("Erro", resultado.mensagem)
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possivel conectar ao sevidor: " + erro);
        }
    };

    useEffect(() => {
        if (codProd.trim() === "") {
            setNomeProduto(null);
            return;
        }


        if (timer) clearTimeout(timer);

        const newTimer = setTimeout(() => {
            buscarProduto();
        }, 500);

        setTimer(newTimer);
    }, [codProd]);

    const buscarProduto = async () => {
        try {
            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/consultarProduto.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ codProd })
            });

            //const texto = await resposta.text();
            //console.log("RESPOSTA BRUTA DA API:", texto);

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                setNomeProduto(resultado.produto);
            } else {
                setNomeProduto(resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possível buscar o produto." + erro);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.form}>
                <View>
                    <Text style={styles.label}>
                        Filial *
                    </Text>
                    <DropdownInput
                        value={codFilial}
                        items={filiais}
                        onChange={(val) => setCodFilial(val)}
                    />

                </View>

                <View>
                    <Text style={styles.label}>
                        Código do produto *
                    </Text>
                    <View style={styles.produtoContainer}>
                        <View style={styles.codigoProdutoInput}>
                            <Input
                                placeholder="Produto"
                                keyboardType="numeric"
                                value={codProd}
                                onChangeText={setCodProd}
                            />
                        </View>
                        <View style={styles.nomeProdutoContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>


                                <Text style={styles.nomeProduto}>
                                    {nomeProduto?.descricao || "Produto não encontrado"}
                                </Text>
                            </ScrollView>
                        </View>

                    </View>
                </View>

                <View>
                    <Text style={styles.label}>
                        Data de Validade *
                    </Text>
                    <DateInput
                        label="Data de Vencimento"
                        value={dataVencimento}
                        onChange={setDataVencimento}
                    />
                </View>

                <View>
                    <Text style={styles.label}>
                        Quantidade *
                    </Text>
                    <Input
                        placeholder="Insira a quantidade"
                        keyboardType="numeric"
                        value={quantidade}
                        onChangeText={setQuantidade}
                    />
                </View>

                <View>
                    <Text style={styles.label}>
                        Observação
                    </Text>
                    <Input
                        placeholder="Digite a sua observação"
                        value={observacao}
                        onChangeText={setObservacao}
                    />
                </View>

                {/*<View style={styles.containerBotoes}>
                    <TouchableOpacity style={styles.buttonResumo} activeOpacity={0.5} onPress={goToResumo}>
                        <Text style={styles.textButton}>
                            Resumo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonInserir} activeOpacity={0.5} onPress={inserirValidade}>
                        <Text style={styles.textButton}>
                            Inserir
                        </Text>
                    </TouchableOpacity>
                </View> */}

                <View style={styles.inserirButton}>
                    <LargeButton
                        title="Inserir"
                        backgroundColor="#737f85ff"
                        onPress={adicionarItem}
                    />
                </View>

                <View style={styles.tableContainer}>
                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.cell}>Codigo</DataTable.Title>
                                <DataTable.Title style={styles.cell}>Data de Validade</DataTable.Title>
                                <DataTable.Title style={styles.cell}>Filial</DataTable.Title>
                                <DataTable.Title style={styles.cell}>Quantidade</DataTable.Title>
                                <DataTable.Title style={styles.cell}>Observacao</DataTable.Title>
                                <DataTable.Title style={styles.cell}>Ações</DataTable.Title>

                            </DataTable.Header>

                            {lista.map((item, index) => (
                                <DataTable.Row key={index}>
                                    <DataTable.Cell style={styles.cell}>{item.codProd}</DataTable.Cell>
                                    <DataTable.Cell style={styles.cell}>{item.dataVencimento.toLocaleDateString("pt-BR")}</DataTable.Cell>
                                    <DataTable.Cell style={styles.cell}>{item.codFilial}</DataTable.Cell>
                                    <DataTable.Cell style={styles.cell}>{item.quantidade}</DataTable.Cell>
                                    <DataTable.Cell style={styles.cell}>{item.observacao}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <TouchableOpacity style={styles.removerButton}>
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

                {lista.length > 0 && (
                    <View style={styles.salvarButton}>
                        <LargeButton
                            title="Salvar"
                        />
                    </View>
                )}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    form: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 14,
    },
    label: {
        color: colors.blue,
        marginBottom: 4,
        fontWeight: "bold"
    },
    produtoContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    codigoProdutoInput: {
        width: "30%"
    },
    nomeProdutoContainer: {
        backgroundColor: "#b7def0ff",
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        width: "65%"
    },
    nomeProduto: {
        fontSize: 15,
        color: colors.blue,
        fontWeight: "bold"
    },
    inserirButton: {
        marginBottom: 20,
    },
    salvarButton: {
        marginTop: 30,
    },
    containerBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    textButton: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",

    },

    tableContainer: {
        paddingHorizontal: 14,

    },
    cell: {
        paddingHorizontal: 10,
        minWidth: 120, //
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
    buttonResumo: {
        backgroundColor: "#4A5A6A",
        height: 48,
        width: "45%",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",

    },
    buttonInserir: {
        backgroundColor: "#DA0100",
        height: 48,
        width: "45%",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",

    },

});