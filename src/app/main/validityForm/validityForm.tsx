import { DateInput } from "@/components/dateInput";
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import ModalPopup from "@/components/modalPopup";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { validityInsertStore } from "../../../../store/validityInsertStore";

import { useNavigation } from "expo-router";

export default function ValidityForm() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    //Dados do Store
    const productsList = validityInsertStore((state) => state.productsList);
    const addProduct = validityInsertStore((state) => state.addProduct);

    //Codigo do produto
    const [codProduct, setCodProduct] = useState("");

    const [description, setDescription] = useState("");

    //Data de Vencimento
    const [validityDate, setValidityDate] = useState<Date | undefined>(undefined);

    //Quantidade
    const [quantity, setQuantity] = useState("");

    //Texto de observação
    const [observation, setObservation] = useState("");

    const [loading, setLoading] = useState(false);

    //Timer para consulta do produto
    const [timer, setTimer] = useState<number | null>(null);

    const navigation = useNavigation();

    const [showExitModal, setShowExitModal] = useState(false);
    const [exitAction, setExitAction] = useState<any>(null);

    // Consumindo API em python para consulta de produto:
    const productSearch = async () => {
        try {
            setLoading(true);
            const resposta = await fetch("https://api.hipersenna.com/api/prod?codprod=" + codProduct, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer fbf722488af02d0a7c596872aec73db9"
                },
            });

            //  const texto = await resposta.text();
            //  console.log("RESPOSTA BRUTA DA API:", texto);

            const resultado = await resposta.json();

            if (Array.isArray(resultado) && resultado.length > 0 && resultado[0].descricao) {
                setDescription(resultado[0].descricao);
            } else {
                setDescription(resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro!", "Não foi possível buscar o produto." + erro);
        } finally {
            setLoading(false);
        }
    };

    //Função de adicionar item na lista de produtos e limpar os campos
    function handlerAdicionar() {
        if (!codProduct || !validityDate || !quantity) {
            Alert.alert("Atenção!", "Preencha todos os campos obrigatórios!")
            return;
        } if (!description) {
            Alert.alert("Erro!", "Produto não encontrado!");
            return;
        }

        addProduct({
            product_cod: Number(codProduct),
            description,
            validity_date: validityDate,
            quantity: Number(quantity),
            observation
        });

        setCodProduct("");
        setQuantity("");
        setDescription("");
        setValidityDate(undefined);

    }

    //Função para capturar o botão de voltar
    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            e.preventDefault(); // bloqueia a navegação
            setExitAction(e.data.action); // salva a ação para executar depois
            setShowExitModal(true); // mostra o modal personalizado
        });

        return unsubscribe;
    }, [navigation]);

    const handleConfirmExit = () => {
        setShowExitModal(false);
        if (exitAction) {
            navigation.dispatch(exitAction); // executa a navegação original
        }
    };

    const handleCancelExit = () => {
        setShowExitModal(false);
        setExitAction(null);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
            <View style={styles.formBox}>
                <View style={styles.productInfoBox}>
                    <View style={styles.productCodeBox}>
                        <View style={{ width: "65%" }}>
                            <Input
                                IconRight={FontAwesome}
                                iconRightName="search"
                                label="Código do produto *"
                                placeholder="Produto"
                                keyboardType="numeric"
                                value={codProduct}
                                onChangeText={(codProd) => setCodProduct(codProd.replace(/[^0-9]/g, ""))}
                            />
                        </View>
                        <View style={styles.searchBox}>
                            <TouchableOpacity
                                style={[styles.searchButton, { backgroundColor: theme.red }]}
                                onPress={productSearch}
                            >
                                <Text style={[styles.searchText, { color: theme.navText }]}>
                                    Buscar
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                <View style={[styles.productNameBox, { backgroundColor: theme.uiBackground }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Text style={[styles.productNameText, { color: theme.title }]}>
                            {loading ? <ActivityIndicator /> : description || "Produto não encontrado"}
                        </Text>
                    </ScrollView>
                </View>

                <View>
                    <DateInput
                        label="Data de Validade *"
                        placeholder="Data de Vencimento"
                        value={validityDate}
                        onChange={setValidityDate}
                    />
                </View>

                <View>
                    <Input
                        label="Quantidade *"
                        placeholder="Insira a quantidade"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={(quantity) => setQuantity(quantity.replace(/[^0-9]/g, ""))}
                    />
                </View>

                {/* <View>
                    <Input
                        label="Observação"
                        placeholder="Digite a sua observação"
                        value={observation}
                        onChangeText={setObservation}
                    />
                </View> */}

                <View style={styles.buttonsBox}>
                    <View style={styles.summaryButton}>
                        <LargeButton
                            text="Inserir"
                            backgroundColor={Colors.gray}
                            onPress={handlerAdicionar}
                        />
                    </View>

                    {productsList.length > 0 && (

                        <View style={styles.summaryButton}>
                            <LargeButton
                                text="Resumo"
                                onPress={() => {
                                    console.log(productsList); router.push("./validitySummary")
                                }}
                                backgroundColor={theme.red}
                            />
                        </View>
                    )}

                </View>
            </View>

            <ModalPopup
                visible={showExitModal}
                onRequestClose={handleCancelExit}
                buttonLeft={handleCancelExit}
                buttonRight={handleConfirmExit}
            />

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    formBox: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    productInfoBox: {
    },
    productCodeBox: {
        flexDirection: "row",

    },
    searchBox: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flex: 1,
        paddingBottom: 10,
        paddingLeft: 10
    },
    searchButton: {
        width: "100%",
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,

    },
    searchText: {
        fontFamily: "Lexend-Bold",
        fontSize: 18

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
        color: Colors.gray,
        fontFamily: "Lexend-Bold",
    },
    buttonsBox: {
        marginTop: 40
    },
    summaryButton: {
        marginBottom: 20,
    },

});