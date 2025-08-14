import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { DateInput } from "@/components/dateInput";
import { Input } from "@/components/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../../constants/colors";
import { DropdownInput } from "@/components/dropdownInput";
import { LargeButton } from "@/components/largeButton";
import { DataTable } from "react-native-paper";
import { useVistoriaStore } from "../../store/useVistoriaStore";

export default function VistoriaFormulario() {

    //Dados do Store
    const lista = useVistoriaStore((state) => state.lista);
    const adicionarItem = useVistoriaStore((state) => state.adicionarItem);
    const resetarLista = useVistoriaStore((state) => state.resetarLista);
    const setUserId = useVistoriaStore((state) => state.setUserId);
    const setNomeProduto = useVistoriaStore((state) => state.setNomeProduto);
    const nomeProduto = useVistoriaStore((state) => state.nomeProduto);

    //Codigo da filial
    const [codFilial, setCodFilial] = React.useState<string | null>(null);

    //Opções do select de filial
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

    //Timer para consulta do produto
    const [timer, setTimer] = useState<number | null>(null);

    //Data de Vencimento
    const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined);

    //Quantidade
    const [quantidade, setQuantidade] = useState("");

    //Texto de observação
    const [observacao, setObservacao] = useState("");

    //Função de adicionar item na lista
    function handlerAdicionar() {
        if (!codProd || !codFilial || !dataVencimento || !quantidade) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios!")
            return;
        }

        adicionarItem({
            codProd,
            codFilial,
            dataVencimento: new Date(),
            quantidade,
            observacao: "",
            nomeProduto: nomeProduto || "",
        });

        setCodProd("");
        setCodFilial("");
        setDataVencimento(undefined);
        setQuantidade("");
        setObservacao("");

    }

    //Pegar ID do usuário que vêm de outra tela na hora que renderizar
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

    //Busca o produto no banco via API
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
                setNomeProduto(resultado.produto.descricao);
            } else {
                setNomeProduto(resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possível buscar o produto." + erro);
        }
    };

    // Consumindo API em python para consulta de produto:
    const buscarProduto2 = async () => {
        try {
            const resposta = await fetch("https://api.hipersenna.com/api/prod?codprod=" + codProd , {
                method: "GET",
                headers: {
                    /* "Content-Type": "application/json", */
                    "Authorization": "Bearer fbf722488af02d0a7c596872aec73db9"
                },
            });

            // const texto = await resposta.text();
            // console.log("RESPOSTA BRUTA DA API:", texto);

            const resultado = await resposta.json();

            if (Array.isArray(resultado) && resultado.length > 0 && resultado[0].descricao){
                setNomeProduto(resultado[0].descricao);
            } else {
                setNomeProduto(resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possível buscar o produto." + erro);
        }
    };

    useEffect(() => {
        if (codProd.trim() === "") {
            setNomeProduto(null);
            return;
        }

        if (timer) clearTimeout(timer);

        const newTimer = setTimeout(() => {
            buscarProduto2();
        }, 500);

        setTimer(newTimer);
    }, [codProd]);



    const goToResumo = () => {
        router.push("/resumo");
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
                                    {nomeProduto || "Produto não encontrado"}
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

                <View style={styles.inserirButton}>
                    <LargeButton
                        title="Inserir"
                        backgroundColor="#737f85ff"
                        onPress={handlerAdicionar}
                    />
                </View>

                {lista.length > 0 && (

                    <View style={styles.inserirButton}>
                        <LargeButton
                            title="Resumo"
                            onPress={goToResumo}
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
        paddingHorizontal: 14,
        paddingTop: 20,
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
        backgroundColor: "#9db1bbff",
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        width: "65%"
    },
    nomeProduto: {
        fontSize: 15,
        color: "#113b58ff",
        fontWeight: "bold"
    },
    inserirButton: {
        marginBottom: 20,
    },


});