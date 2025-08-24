import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Image } from "react-native";
import colors from "../../constants/colors";
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { useUserDadosStore } from "../../store/useUserDadosStore";
import { useVistoriaProdutoStore } from "../../store/useVistoriaProdutosStore";
import DropDownPicker from "react-native-dropdown-picker";

export default function Demandas() {

    type SolicitacaoInfo = {
        solicitacaoId: number;
        cod_filial: string | number;
        status: string | null;
        dataSolicitacao: string;
        analistaId: number;
        produtos: [];
    };

    const userId = useUserDadosStore((state) => state.userId);
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoInfo[]>([]);
    const setProdutos = useVistoriaProdutoStore((state) => state.setProdutos);

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

    function getColor(status: string | null) {
        if (status === "pendente") return "#FF6200";
        if (status === "em andamento") return "#51ABFF";
        if (status === "concluido") return "#13BE19";
        if (status === "expirado") return "#E80000";
        return "black";
    }

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <Header
                title="Demanda"
                navigationType="back"
            />
            <View style={styles.containerConteudo}>
                <View style={styles.filtros}>
                    <Text style={styles.filtrosText}>
                        Ordernar Por:
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    <FlatList
                        data={solicitacoes}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => { router.push("/demandaProdutos"); setProdutos(item.produtos); }}
                            >
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>
                                        #{item.solicitacaoId}
                                    </Text>
                                    <View style={styles.dadosItem}>
                                        <View>
                                            <Text style={styles.text}><Text style={styles.label}>Filial:</Text> {item.cod_filial}</Text>
                                            <Text style={styles.label}>HortiFruti | Frios</Text>
                                            <View style={styles.datas}>
                                                <Text style={styles.text}><Text style={styles.label}>Dt. Criação:</Text> {new Date(item.dataSolicitacao).toLocaleDateString("pt-BR")}</Text>
                                                <Text style={styles.text}><Text style={styles.label}>Dt. Limite:</Text> {new Date(item.dataSolicitacao).toLocaleDateString("pt-BR")}</Text>
                                            </View>
                                            <View style={styles.statusContainer}>
                                                <Text style={styles.label}>
                                                    Status:
                                                </Text>
                                                <View style={[styles.dotView, { backgroundColor: getColor(item.status) }]}></View>
                                                <Text style={[styles.status, { color: getColor(item.status) }]}>
                                                    {item.status}
                                                </Text>
                                            </View>

                                        </View>
                                        <View style={styles.containerButton}>
                                            <Image
                                                style={styles.verMaisIcon}
                                                source={require("../../assets/images/Vector-1x.png")}
                                                 resizeMode="contain" 
                                            />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerConteudo: {
        paddingHorizontal: 14,
        paddingTop: 20,
        flex: 1,
    },
    filtros: {
        backgroundColor: colors.gray,
        width: "35%",
        height: "4%",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"
    },
    filtrosText: {
        fontFamily: "Lexend-Regular",
        color: "white"
    },
    cardsContainer: {
        paddingVertical: 20
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 15,
        borderColor: colors.gray,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: "Lexend-Bold",
        color: colors.blue,

    },
    label: {
        fontFamily: "Lexend-Regular",
        color: colors.blue,
    },
    text:{
        color: colors.gray,
        fontFamily: "Lexend-Regular"
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
        width: 24,
        height: 24,
        
    },
    buttonVerMais: {
        paddingLeft: 100,
        paddingRight: 10,
        paddingVertical: 10,
        alignItems: "center",

    },
    datas: {
        
    },
    statusContainer:{
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    dotView: {
        borderRadius: 50,
        width: 13,
        height: 13,
    },
    status: {
        fontFamily: "Lexend-Regular"
    }

})