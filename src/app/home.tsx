import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, BackHandler, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { SmallButton } from "@/components/smallButton";
import colors from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const [userId, setUserId] = useState<string | null>(null);
    const [count, setCount] = useState(0);
    const [backPressedOnce, setBackPressedOnce] = useState(false);

    const goToVistoria = () => {
        router.push("/vistoriaFormulario");
    }

    const goToHistorico = () => {
        router.push("/historico");
    }

    const goToRelatorios = () => {
        router.push("/relatorios");
    }

    const goToVistoriaSolicitacoes = () => {
        router.push("/vistoriaSolicitacoes");
    }

    const goToVistoriaDemanda = () => {
        router.push("/vistoriaDemanda");
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


    useEffect(() => {
        if (!userId) return;

        const fetchCount = async () => {
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
                    setCount(resultado.quantidade_vistorias);
                }

            } catch (error) {
                console.error("Erro ao buscar contagem: ", error);
            }
        };

        fetchCount();

        const interval = setInterval(fetchCount, 10000);

        return () => clearInterval(interval);

    }, [userId]);

    // useEffect(() => {
    //     const onBackPress = () => {
    //         if (backPressedOnce) {
    //             BackHandler.exitApp();
    //             return true;
    //         }

    //         setBackPressedOnce(true);
    //         ToastAndroid.show("Pressione voltar novamente para sair", ToastAndroid.SHORT);

    //         const timer = setTimeout(() => {
    //             setBackPressedOnce(false);
    //         }, 2000);

    //         return true;
    //     };

    //     const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    //     return () => backHandler.remove();
    // }, [backPressedOnce]);


    return (

        <SafeAreaView style={styles.container} edges={["bottom"]}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Validade</Text>
                <TouchableOpacity style={styles.buttonHeader} onPress={() => router.push("/settings")}>
                    <Image style={styles.gearIcon} source={require("../../assets/images/White-Gear.png")} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.containerBemVindo}>
                    <Text style={styles.tituloBemVindo}>
                        Bem vindo de volta!
                    </Text>
                    <View style={styles.containerbuttons}>
                        <SmallButton
                            title="Histórico"
                            onPress={goToHistorico}
                            backgroundColor={colors.gray}
                        />
                        <SmallButton
                            title="Add"
                            onPress={goToVistoria} />
                    </View>
                </View>



                <View style={styles.containerDashboard}>
                    <Text style={styles.titulo}>
                        Dashboard
                    </Text>
                    <View style={styles.dashboardRowItens}>
                        <View style={styles.dashboardItem}>
                            <Text style={styles.dashboardItemText}>Total de {"\n"}vistorias: </Text>
                            <Text style={styles.dashboardItemValue}>{count}</Text>
                        </View>
                        <View style={styles.dashboardItem}>
                            <Text style={styles.dashboardItemText}>Vencerão em {"\n"}breve</Text>
                            <Text style={styles.dashboardItemValue}>0</Text>
                        </View>
                    </View>
                    <View style={styles.dashboardLargeItem}>
                        <Text style={styles.dashboardItemText}>Vencidos </Text>
                        <Text style={styles.dashboardItemValue}>0</Text>
                    </View>
                </View>

                <View style={styles.containerAcessoRapido}>
                    <Text style={styles.titulo}>
                        Acesso rápido
                    </Text>
                    <View>
                        <TouchableOpacity onPress={goToVistoriaSolicitacoes}>
                            <View style={styles.opcaoMenu}>
                                <Image style={styles.imgIcon} source={require("../../assets/images/SinoIcon.png")} />
                                <Text style={styles.textOptions}>Solicitações de Vistoria</Text>
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
    },
    scrollContainer: {
        color: colors.blue,
        paddingHorizontal: 14,
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 40,
        paddingBottom: 15,
        paddingHorizontal: 14,
        backgroundColor: "red",
        elevation: 3,
    },
    headerText: {
        fontSize: 22,
        fontFamily: "Lexend-Bold",
        color: "white",
    },
    buttonHeader: {
        padding: 5,
    },
    gearIcon: {
        width: 25,
        height: 25,
    },
    imgIcon: {

    },
    containerBemVindo: {
        paddingBottom: 30,
        borderBottomColor: colors.blue,
        borderBottomWidth: 1,
    },
    tituloBemVindo: {
        textAlign: "center",
        fontSize: 28,
        fontFamily: "Lexend-Bold",
        paddingBottom: 20,
        paddingTop: 20,
        color: "#205072",
    },
    containerbuttons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerDashboard: {
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomColor: colors.blue,
        borderBottomWidth: 1,
    },
    titulo: {
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
        backgroundColor: "#F4F6F8",
        height: 134,
        width: "45%",
        borderRadius: 12,
        justifyContent: "center",
    },
    dashboardItemText: {
        fontSize: 14,
        color: "#205072",
        paddingLeft: 20,
        fontFamily: "Lexend-Regular",

    },
    dashboardItemValue: {
        fontSize: 22,
        fontFamily: "Lexend-Bold",
        color: "#205072",
        paddingLeft: 20,
    },
    dashboardLargeItem: {
        backgroundColor: "#F4F6F8",
        height: 134,
        width: "100%",
        borderRadius: 12,
        justifyContent: "center",
        marginTop: 20,

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
        color: colors.blue,
        fontSize: 16,
        fontFamily: "Lexend-Regular",
    }
})