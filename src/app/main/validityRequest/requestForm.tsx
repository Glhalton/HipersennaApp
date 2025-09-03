import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { requestsInsertStore } from "../../../../store/requestsInsertStore";

export default function RequestForm() {

    const lista = requestsInsertStore((state) => state.lista);
    const adicionarItem = requestsInsertStore((state) => state.adicionarItem);
    const removerItem = requestsInsertStore((state) => state.removerItem);
    const resetarLista = requestsInsertStore((state) => state.resetarLista);
    const setNomeProduto = requestsInsertStore((state) => state.setNomeProduto);
    const nomeProduto = requestsInsertStore((state) => state.nomeProduto);

    const [loading, setLoading] = useState(false);

    //Codigo do produto
    const [codProd, setCodProd] = useState("");

    //Timer para consulta do produto
    const [timer, setTimer] = useState<number | null>(null);

    // Consumindo API em python para consulta de produto:
    const buscarProduto2 = async () => {
        try {
            setLoading(true)
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
        } finally{
            setLoading(false)
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
        router.push("./resumoSolicitacao");
    };

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Header
                text="Solicitação Vistoria"
                navigationType="back"
            />

            <View style={styles.form}>
                <View>
                    <View style={styles.productInfoBox}>
                        <View style={styles.productCodeBox}>
                            <Input
                                IconRight={FontAwesome}
                                iconRightName="filter"
                                label="Código do produto *"
                                placeholder="Produto"
                                keyboardType="numeric"
                                value={codProd}
                                onChangeText={(codProd) => setCodProd(codProd.replace(/[^0-9]/g, ""))}
                            />
                        </View>
                    </View>
                    <View style={styles.productNameBox}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text style={styles.productNameText}>
                                {loading ? <ActivityIndicator color={colors.blue} /> : nomeProduto || "Produto não encontrado"}
                            </Text>
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.containerButtons}>
                    <View style={styles.inserirButton}>
                        <LargeButton
                            text="Inserir"
                            backgroundColor={colors.gray}
                            onPress={handlerAdicionar}
                        />
                    </View>

                    {lista.length > 0 && (

                        <View style={styles.inserirButton}>
                            <LargeButton
                                text="Resumo"
                                onPress={() => router.push("./requestSummary")}
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

    containerButtons: {
        marginTop: 40
    },
    inserirButton: {
        marginBottom: 20,
    },

    productInfoBox: {

    },
    productCodeBox: {
    },
    productNameBox: {
        backgroundColor: "#e4e4e4cc",
        marginBottom: 16,
        padding: 16,
        borderRadius: 20,
        alignItems: "center"
    },
    productNameText: {
        fontSize: 15,
        color: colors.gray,
        fontFamily: "Lexend-Bold",
    },

});