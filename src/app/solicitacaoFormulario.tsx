import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Input } from "@/components/input";
import { router } from "expo-router";
import colors from "../../constants/colors";
import { DropdownInput } from "@/components/dropdownInput";
import { LargeButton } from "@/components/largeButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { useCriarSolicitacaoStore } from "../../store/useCriarSolicitacaoStore";

export default function SolicitacaoFormulario() {

    const lista = useCriarSolicitacaoStore((state) => state.lista);
    const adicionarItem = useCriarSolicitacaoStore((state) => state.adicionarItem);
    const removerItem = useCriarSolicitacaoStore((state) => state.removerItem);
    const resetarLista = useCriarSolicitacaoStore((state) => state.resetarLista);
    const setNomeProduto = useCriarSolicitacaoStore((state) => state.setNomeProduto);
    const nomeProduto = useCriarSolicitacaoStore((state) => state.nomeProduto);

    //Codigo do produto
    const [codProd, setCodProd] = useState("");

    //Timer para consulta do produto
    const [timer, setTimer] = useState<number | null>(null);

    // Consumindo API em python para consulta de produto:
    const buscarProduto2 = async () => {
        try {
            const resposta = await fetch("https://api.hipersenna.com/api/prod?codprod=" + codProd, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer fbf722488af02d0a7c596872aec73db9"
                },
            });

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

    function handlerAdicionar() {
        if (!codProd) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios!")
            return;
        } if (!nomeProduto) {
            Alert.alert("Erro", "Produto não encontrado!");
            return;
        }

        adicionarItem({
            codProd,
            nomeProduto: nomeProduto || "",
        });
        setCodProd("");
    }

    const goToResumoSolicitacao = () => {
        router.push("/resumoSolicitacao");
    };

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Header
                title="Solicitação Vistoria"
            />

            <View style={styles.form}>
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
                                onPress={goToResumoSolicitacao}
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