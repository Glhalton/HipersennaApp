import { SmallButton } from "@/components/smallButton";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../constants/colors";
import { userDataStore } from "../../../store/userDataStore";
import { Ionicons, MaterialIcons, Feather, FontAwesome5, Octicons } from "@expo/vector-icons";

export default function Home() {

    const userId = userDataStore((state) => state.userId);
    const nivelAcesso = userDataStore((state) => state.nivelAcesso)
    const [primeiroNome, setPrimeiroNome] = useState("");
    const [countValidade, setCountValidade] = useState(0);

    const goToHistorico = () => {
        router.push("./history");
    }

    const goToRelatorios = () => {
        router.push("./selectReport");
    }

    const goToVistoriaDemanda = () => {
        router.push("./validityRequest/requests");
    }

    const goToSelecaoTipoVistoria = () => {
        router.push("./validityForm/selectType");
    }

    const goToSelecaoFilial2 = () => {
        router.push("./validityRequest/selectFilialRequest");
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
                    console.log("Foi buscado a contagem de vistorias")
                    setPrimeiroNome(resultado.primeiroNome);
                }

            } catch (error) {
                console.error("Erro ao buscar contagem: ", error);
            }
        };

        contarVistorias();

    }, []);

    return (

        <SafeAreaView className="bg-red-200" style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.contentStyleScroll} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.helloText}>
                            Olá, {primeiroNome}.
                        </Text>
                        <Text style={styles.subTitleText}>
                            SennaApp
                        </Text>

                    </View>

                    <TouchableOpacity style={styles.settings} onPress={() => router.push("./settings")}>
                        <Ionicons
                            name="settings-sharp"
                            color={colors.gray}
                            size={30}

                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonsBox}>

                    {/* <SmallButton
                            title="Histórico"
                            onPress={goToHistorico}
                            backgroundColor={colors.gray}
                        /> */}
                    <TouchableOpacity
                        style={styles.historicBox}
                        onPress={goToHistorico}
                    >
                        <MaterialIcons
                            name="history"
                            size={50}
                            color={colors.white}
                        />
                        <Text style={styles.buttonsText}>
                            Histórico
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.addBox}
                        onPress={goToSelecaoTipoVistoria}
                    >
                        <Feather
                            name="clipboard"
                            size={50}
                            color={colors.white}
                        />
                        <Text style={styles.buttonsText}>
                            Vistoria
                        </Text>
                    </TouchableOpacity>
                    {/* <SmallButton
                            title="Add"
                            onPress={goToSelecaoTipoVistoria}
                            backgroundColor={colors.red2}
                        /> */}

                </View>

                <View style={styles.dashboardBox}>
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
                        {/* {Number(nivelAcesso) == 2 || Number(nivelAcesso) == 3 && (
                            <TouchableOpacity onPress={goToSelecaoFilial2}>
                                <View style={styles.opcaoMenu}>
                                    <Octicons
                                        name="plus-circle"
                                        color={colors.gray}
                                        size={21}
                                    />
                                    <Image style={styles.imgIcon} source={require("../../../assets/images/SinoIcon.png")} />
                                    <Text style={styles.textOptions}>Criar Solicitação</Text>
                                </View>
                            </TouchableOpacity>
                        )} */}

                        <TouchableOpacity onPress={goToVistoriaDemanda}>
                            <View style={styles.opcaoMenu}>
                                <Octicons
                                    name="checklist"
                                    color={colors.gray}
                                    size={25}
                                />
                                {/* <Image style={styles.imgIcon} source={require("../../../assets/images/MenuIcon.png")} /> */}
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
        backgroundColor: colors.black,
        alignItems: "center",
    },
    scroll: {
        backgroundColor: colors.background,
        width: "100%",
        maxWidth: 600
    },
    contentStyleScroll: {
        color: colors.blue,
        paddingHorizontal: 14,
        paddingVertical: 20,

    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: 20,
    },
    helloText: {
        fontSize: 22,
        fontFamily: "Lexend-SemiBold",
        color: colors.blue,
    },
    subTitleText: {
        fontFamily: "Lexend-Regular",
        color: colors.gray,
        fontSize: 18,
    },
    settings: {
        width: 30,
        height: 30,
    },
    buttonsBox: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    historicBox: {
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: colors.gray,
        borderRadius: 20,
        width: "47%",
        gap: 5,
    },
    addBox: {
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: colors.red2,
        borderRadius: 20,
        width: "47%",
        gap: 5,
    },
    buttonsText: {
        fontFamily: "Lexend-SemiBold",
        color: colors.white,
    },
    dashboardBox: {
        paddingTop: 20,
        paddingBottom: 30,
    },
    title: {
        fontSize: 22,
        fontFamily: "Lexend-SemiBold",
        color: colors.blue,
        marginBottom: 15,
    },
    dashboardRowItens: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dashboardItem: {
        backgroundColor: colors.white,
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
        backgroundColor: colors.white,
        borderRadius: 12,
        marginTop: 20,
        padding: 24
    },
    containerAcessoRapido: {
        paddingTop: 20,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
    },
    opcaoMenu: {
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
        gap: 20,
    },
    textOptions: {
        color: colors.gray,
        fontSize: 16,
        fontFamily: "Lexend-Regular",
    },
})