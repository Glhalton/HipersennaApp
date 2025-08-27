import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { DateInput } from "@/components/dateInput";
import { Input } from "@/components/input";
import { router } from "expo-router";
import colors from "../../constants/colors";
import { LargeButton } from "@/components/largeButton";
import { useVistoriaStore } from "../../store/useVistoriaStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { useCallback } from "react";


export default function VistoriaFormulario() {

    //Dados do Store
    const lista = useVistoriaStore((state) => state.lista);
    const adicionarItem = useVistoriaStore((state) => state.adicionarItem);
    const resetarLista = useVistoriaStore((state) => state.resetarLista);
    const setNomeProduto = useVistoriaStore((state) => state.setNomeProduto);
    const nomeProduto = useVistoriaStore((state) => state.nomeProduto);
    const codFilial = useVistoriaStore((state) => state.codFilial);

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

    //Função de adicionar item na lista e limpar os campos
    function handlerAdicionar() {
        if (!codProd || !dataVencimento || !quantidade) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios!")
            return;
        } if (!nomeProduto) {
            Alert.alert("Erro", "Produto não encontrado!");
            return;
        }

        adicionarItem({
            codProd,
            dataVencimento: new Date(),
            quantidade,
            observacao: "",
            nomeProduto: nomeProduto || "",
        });

        setCodProd("");
        setDataVencimento(undefined);
        setQuantidade("");

    }

    useEffect(() => {
        console.log(codFilial)
    }, [])

    // //Busca o produto no banco via API PHP
    // const buscarProduto = async () => {
    //     try {
    //         const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/consultarProduto.php", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({ codProd })
    //         });

    //         //const texto = await resposta.text();
    //         //console.log("RESPOSTA BRUTA DA API:", texto);

    //         const resultado = await resposta.json();

    //         if (resultado.sucesso) {
    //             setNomeProduto(resultado.produto.descricao);
    //         } else {
    //             setNomeProduto(resultado.mensagem);
    //         }
    //     } catch (erro) {
    //         Alert.alert("Erro", "Não foi possível buscar o produto." + erro);
    //     }
    // };

    // Consumindo API em python para consulta de produto:
    const buscarProduto2 = async () => {
        try {
            const resposta = await fetch("https://api.hipersenna.com/api/prod?codprod=" + codProd, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer fbf722488af02d0a7c596872aec73db9"
                },
            });

            //  const texto = await resposta.text();
            //  console.log("RESPOSTA BRUTA DA API:", texto);

            const resultado = await resposta.json();

            if (Array.isArray(resultado) && resultado.length > 0 && resultado[0].descricao) {
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
        router.push("/resumoValidade");
    };

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Header
                title="Vistoria"
                navigationType="back"
            />

            <View style={styles.form}>
                {/* <View>
                    <Text style={styles.label}>
                        Filial *
                    </Text>
                    <DropdownInput
                        value={codFilial}
                        items={filiais}
                        onChange={(val) => setCodFilial(val)}
                    />

                </View> */}

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
                                onChangeText={(codProd) => setCodProd(codProd.replace(/[^0-9]/g, ""))}
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
                        onChangeText={(quantidade) => setQuantidade(quantidade.replace(/[^0-9]/g, ""))}
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

                <View style={styles.containerButtons}>
                    <View style={styles.inserirButton}>
                        <LargeButton
                            title="Inserir"
                            backgroundColor={colors.gray}
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
        </SafeAreaView>

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
        fontFamily: "Lexend-Bold",
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
        fontFamily: "Lexend-Bold",
    },
    containerButtons: {
        marginTop: 40
    },
    inserirButton: {
        marginBottom: 20,
    },

});