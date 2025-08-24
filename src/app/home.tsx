import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SmallButton } from "@/components/smallButton";
import colors from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserDadosStore } from "../../store/useUserDadosStore";

export default function Home() {

    const userId = useUserDadosStore((state) => state.userId);
    const [primeiroNome, setPrimeiroNome] = useState("");
    const [countValidade, setCountValidade] = useState(0);

    const goToVistoria = () => {
        router.push("/vistoriaFormulario");
    }

    const goToHistorico = () => {
        router.push("/historico");
    }

    const goToRelatorios = () => {
        router.push("/relatorios");
    }

    const goToVistoriaDemanda = () => {
        router.push("/demandas");
    }

    const goToSelecaoFilial1 = () => {
        router.push("/selecaoFilial1");
    }

    const goToSelecaoFilial2 = () => {
        router.push("/selecaoFilial2");
    }

    useEffect(() => {
        if (!userId) return;

        const contarVistorias = async () => {
            try {
                const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/home/dadosUsuario.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId
                    })
                });

                const resultado = await resposta.json();

                if (resultado.sucesso) {
                    setCountValidade(resultado.quantidade_vistorias);
                    setPrimeiroNome(resultado.primeiroNome);
                    console.log("Foi buscado a contagem de vistorias")
                }

            } catch (error) {
                console.error("Erro ao buscar contagem: ", error);
            }
        };

        contarVistorias();

    }, []);

    return (

        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Validade</Text>
                <TouchableOpacity style={styles.settings} onPress={() => router.push("/settings")}>
                    <Image style={styles.settingsImage} source={require("../../assets/images/White-Gear.png")} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.contentStyleScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.bemVindoContainer}>
                    <Text style={styles.bemVindoText}>
                        Bem vindo de volta, {primeiroNome}!
                    </Text>

                    <View style={styles.buttonsContainer}>
                        <SmallButton
                            title="Histórico"
                            onPress={goToHistorico}
                            backgroundColor={colors.gray}
                        />
                        <SmallButton
                            title="Add"
                            onPress={goToSelecaoFilial1}
                            backgroundColor={colors.red2} />
                    </View>
                </View>

                <View style={styles.dashboardContainer}>
                    <Text style={styles.title}>
                        Dashboard
                    </Text>

                    <View style={styles.dashboardRowItens}>
                        <View style={styles.dashboardItem}>
                            <Text style={styles.dashboardItemText}>Total de vistorias: </Text>
                            <Text style={styles.dashboardItemValue}>{countValidade}</Text>
                        </View>
                        <View style={styles.dashboardItem}>
                            <Text style={styles.dashboardItemText}>Vencerão em breve:</Text>
                            <Text style={styles.dashboardItemValue}>0</Text>
                        </View>
                    </View>
                    <View style={styles.dashboardLargeItem}>
                        <Text style={styles.dashboardItemText}>Vencidos:</Text>
                        <Text style={styles.dashboardItemValue}>0</Text>
                    </View>
                </View>

                <View style={styles.containerAcessoRapido}>
                    <Text style={styles.title}>
                        Acesso rápido
                    </Text>
                    <View>

                        <TouchableOpacity onPress={goToSelecaoFilial2}>
                            <View style={styles.opcaoMenu}>
                                <Image style={styles.imgIcon} source={require("../../assets/images/SinoIcon.png")} />
                                <Text style={styles.textOptions}>Criar Solicitação</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={goToVistoriaDemanda}>
                            <View style={styles.opcaoMenu}>
                                <Image style={styles.imgIcon} source={require("../../assets/images/MenuIcon.png")} />
                                <Text style={styles.textOptions}>Vistorias à fazer</Text>
                            </View>
                        </TouchableOpacity>



                        {/* <TouchableOpacity>
                            <View style={styles.opcaoMenu}>
                                <Image style={styles.imgIcon} source={require("../../assets/images/GraficosIcon.png")} />
                                <Text style={styles.textOptions}>Monitor de metas</Text>
                            </View >
                        </TouchableOpacity>

                        <TouchableOpacity onPress={goToRelatorios}>
                            <View style={styles.opcaoMenu}>
                                <Image style={styles.imgIcon} source={require("../../assets/images/ArquivoIcon.png")} />
                                <Text style={styles.textOptions}>Gerar relatórios</Text>
                            </View>
                        </TouchableOpacity> */}

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",

    },
    
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingTop: 40,
        paddingBottom: 15,
        paddingHorizontal: 14,
        backgroundColor: colors.red2,
        elevation: 3,
    },
    headerText: {
        fontSize: 22,
        fontFamily: "Lexend-Bold",
        color: "white",
    },
    settings: {
        padding: 5,
    },
    settingsImage: {
        width: 25,
        height: 25,
    },

    scroll:{
        width: "100%",
        maxWidth: 600
    },

    contentStyleScroll: {
        color: colors.blue,
        paddingHorizontal: 14,
        paddingTop: 10,
        


    },
    bemVindoContainer: {
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    bemVindoText: {
        textAlign: "center",
        fontSize: 24,
        fontFamily: "Lexend-Bold",
        paddingBottom: 30,
        paddingTop: 20,
        color: colors.blue,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    dashboardContainer: {
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    title: {
        fontSize: 22,
        fontFamily: "Lexend-Bold",
        color: colors.blue,
        marginBottom: 15,
    },
    dashboardRowItens: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dashboardItem: {
        backgroundColor: colors.lightGray,
        padding: 24,
        width: "45%",
        borderRadius: 12,
    },
    dashboardItemText: {
        fontSize: 16,
        color: colors.blue,
        fontFamily: "Lexend-Regular",
    },
    dashboardItemValue: {
        fontSize: 22,
        fontFamily: "Lexend-Bold",
        color: colors.blue,
    },
    dashboardLargeItem: {
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        marginTop: 20,
        padding: 24
    },
    containerAcessoRapido: {
        paddingTop: 20,
    },
    opcaoMenu: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center",
        gap: 20
    },
    textOptions: {
        color: colors.gray,
        fontSize: 16,
        fontFamily: "Lexend-Regular",
    },
    imgIcon: {

    }
})