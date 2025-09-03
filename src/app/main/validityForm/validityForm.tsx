import { DateInput } from "@/components/dateInput";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { validityInsertStore } from "../../../../store/validityInsertStore";



export default function ValidityForm() {

    //Dados do Store
    const lista = validityInsertStore((state) => state.lista);
    const adicionarItem = validityInsertStore((state) => state.adicionarItem);
    const resetarLista = validityInsertStore((state) => state.resetarLista);
    const setNomeProduto = validityInsertStore((state) => state.setNomeProduto);
    const nomeProduto = validityInsertStore((state) => state.nomeProduto);
    const codFilial = validityInsertStore((state) => state.codFilial);

    const [loading, setLoading] = useState(false);

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
            Alert.alert("Atenção!", "Preencha todos os campos obrigatórios!")
            return;
        } if (!nomeProduto) {
            Alert.alert("Erro!", "Produto não encontrado!");
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
            setLoading(true);
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
            Alert.alert("Erro!", "Não foi possível buscar o produto." + erro);
        } finally {
            setLoading(false);
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
        }, 800);

        setTimer(newTimer);
    }, [codProd]);

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Header
                text="Vistoria"
                navigationType="back"
            />

            <View style={styles.formBox}>
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
                            {loading ? <ActivityIndicator /> : nomeProduto || "Produto não encontrado"}
                        </Text>
                    </ScrollView>
                </View>

                <View>
                    <DateInput
                        label="Data de Validade *"
                        placeholder="Data de Vencimento"
                        value={dataVencimento}
                        onChange={setDataVencimento}
                    />
                </View>

                <View>
                    <Input
                        label="Quantidade *"
                        placeholder="Insira a quantidade"
                        keyboardType="numeric"
                        value={quantidade}
                        onChangeText={(quantidade) => setQuantidade(quantidade.replace(/[^0-9]/g, ""))}
                    />
                </View>

                <View>
                    <Input
                        label="Observação"
                        placeholder="Digite a sua observação"
                        value={observacao}
                        onChangeText={setObservacao}
                    />
                </View>

                <View style={styles.buttonsBox}>
                    <View style={styles.summaryButton}>
                        <LargeButton
                            text="Inserir"
                            backgroundColor={colors.gray}
                            onPress={handlerAdicionar}
                        />
                    </View>

                    {lista.length > 0 && (

                        <View style={styles.summaryButton}>
                            <LargeButton
                                text="Resumo"
                                onPress={() => router.push("./validitySummary")}
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
    formBox: {
        paddingHorizontal: 14,
        paddingTop: 20,
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
    buttonsBox: {
        marginTop: 40
    },
    summaryButton: {
        marginBottom: 20,
    },

});