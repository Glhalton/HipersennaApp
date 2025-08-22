import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, Image } from "react-native";
import { LargeButton } from "@/components/largeButton";
import colors from "../../constants/colors";
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { useUserDadosStore } from "../../store/useUserDadosStore";
import { Background } from "@react-navigation/elements";


export default function VistoriaDemanda() {


    type SolicitacaoInfo = {
        cod_filial: string | number;
        status: string | null;
        dataSolicitacao: string;
        analistaId: number;
    };

    const userId = useUserDadosStore((state) => state.userId);
    const [dados, setDados] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoInfo[]>([]);

    const consultarSolicitacoes = async () => {
        try {
            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/consultarSolicitacao.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
            });


            // const texto = await resposta.text();
            // console.log("RESPOSTA BRUTA DA API:", texto);

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                setSolicitacoes(resultado.solicitacoes);
            } else {
                Alert.alert("Erro", resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possível conectar ao servidor: " + erro);
        }
    };

    useEffect(() => {
        consultarSolicitacoes();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Header
                title="Demanda"
                screen="/home"
            />
            <View style={styles.cardsContainer}>

                <FlatList
                    data={solicitacoes}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                #{index + 1} - {item.analistaId}
                            </Text>
                            <View style={styles.dadosItem}>
                                <View>
                                    <Text><Text style={styles.label}>Filial:</Text> {item.cod_filial}</Text>
                                    <Text><Text style={styles.label}>Criado em:</Text> {new Date(item.dataSolicitacao).toLocaleDateString("pt-BR")}</Text>
                                    <Text><Text style={styles.label}>Status:</Text> {item.status}</Text>
                                </View>
                                <View style={styles.containerButton}>
                                    <TouchableOpacity style={styles.buttonVerMais}>
                                        <Image
                                            style={styles.verMaisIcon}
                                            source={require("../../assets/images/Vector-2x.png")}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardsContainer: {
        paddingHorizontal: 14,
        paddingTop: 20,
        flex: 1,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: "Lexend-Bold",
        marginBottom: 6,
        color: colors.blue,

    },
    label: {
        fontFamily: "Lexend-Regular",
        color: colors.blue,
    },
    dadosItem: {
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "center",
        justifyContent: "space-between"
    },
    containerButton: {
    },
    verMaisIcon: {

    },
    buttonVerMais: {
        paddingLeft: 100,
        paddingRight: 10,
        paddingVertical: 10,
        alignItems: "center",
    },
    removerText: {
        color: "white",
        fontFamily: "Lexend-Bold"
    },
    inserirButton: {
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 20,
    }
})