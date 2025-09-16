import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { userDataStore } from "../../../store/userDataStore";
import { FontAwesome6, Ionicons, Octicons } from "@expo/vector-icons";

export default function Home() {
    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const userId = userDataStore((state) => state.userId);
    const nivelAcesso = userDataStore((state) => state.nivelAcesso)
    const [primeiroNome, setPrimeiroNome] = useState("");
    const [countValidade, setCountValidade] = useState(0);

    const goToVistoriaDemanda = () => {
        router.push("./validityRequest/requests");
    }

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

    useEffect(() => {
        if (!userId) return;
        contarVistorias();

    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView style={[styles.scroll, { backgroundColor: theme.background, }]} contentContainerStyle={styles.contentStyleScroll} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <View>
                        <Text style={[styles.helloText, { color: theme.title }]}>
                            Olá, {primeiroNome}.
                        </Text>
                        <Text style={[styles.subTitleText, { color: theme.text }]}>
                            SennaApp
                        </Text>

                    </View>

                    <TouchableOpacity style={[styles.settings, { backgroundColor: theme.uiBackground }]} onPress={() => router.push("./settings")}>
                        <Ionicons
                            name="settings-sharp"
                            color={theme.iconColor}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>

                <View style={[styles.validityBox, { backgroundColor: theme.uiBackground }]}>
                    <Text style={[styles.title, { color: theme.title }]}>
                        Vistoria
                    </Text>
                    <View style={styles.buttonsBox}>

                        <TouchableOpacity
                            style={[styles.requestBox, {backgroundColor: theme.gray}]}
                            onPress={() => { router.push("./validityForm/selectRequest"); }}
                        >
                            <FontAwesome6
                                name="envelope-open-text"
                                size={50}
                                color={Colors.white}
                            />
                            <Text style={styles.buttonsText}>
                                Solicitação
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.singleBox, {backgroundColor: theme.red}]}
                            onPress={() => { router.push("./validityForm/selectFilialValidity"); }}
                        >
                            <FontAwesome6
                                name="clipboard"
                                size={50}
                                color={Colors.white}
                            />
                            <Text style={styles.buttonsText}>
                                Avulsa
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={[styles.dashboardBox]}>
                    <Text style={[styles.title, { color: theme.title }]}>
                        Dashboard
                    </Text>

                    <View style={[styles.dashboardRowItens,]}>
                        <View style={[styles.dashboardItem, { backgroundColor: theme.uiBackground }]}>
                            <Text style={[styles.dashboardItemText, { color: theme.text }]}>Total de vistorias: </Text>
                            <Text style={[styles.dashboardItemValue, { color: theme.text }]}>{countValidade}</Text>
                        </View>
                        <View style={[styles.dashboardItem, { backgroundColor: theme.uiBackground }]}>
                            <Text style={[styles.dashboardItemText, { color: theme.text }]}>Vencerão em breve:</Text>
                            <Text style={[styles.dashboardItemValue, { color: theme.text }]}>0</Text>
                        </View>
                    </View>
                    <View style={[styles.dashboardLargeItem, { backgroundColor: theme.uiBackground }]}>
                        <Text style={[styles.dashboardItemText, { color: theme.text }]}>Vencidos:</Text>
                        <Text style={[styles.dashboardItemValue, { color: theme.text }]}>0</Text>
                    </View>
                </View>

                <View style={[styles.containerAcessoRapido, { backgroundColor: theme.uiBackground }]}>
                    <Text style={[styles.title, { color: theme.title }]}>
                        Acesso rápido
                    </Text>
                    <View>
                        {/* {Number(nivelAcesso) == 2 || Number(nivelAcesso) == 3 && (
                            <TouchableOpacity onPress={goToSelecaoFilial2}>
                                <View style={styles.opcaoMenu}>
                                    <Octicons
                                        name="plus-circle"
                                        color={Colors.gray}
                                        size={21}
                                    />
                                    <Image style={styles.imgIcon} source={require("../../../assets/images/SinoIcon.png")} />
                                    <Text style={styles.textOptions}>Criar Solicitação</Text>
                                </View>
                            </TouchableOpacity>
                        )} */}

                        <TouchableOpacity onPress={goToVistoriaDemanda} style={{ borderBottomWidth: 1, borderColor: Colors.gray }}>
                            <View style={styles.opcaoMenu}>
                                <View style={styles.optionIcon}>
                                    <Octicons
                                        name="checklist"
                                        color={theme.iconColor}
                                        size={25}
                                    />
                                </View>

                                <Text style={[styles.textOptions, { color: theme.text }]}>Vistorias à fazer</Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => { router.push("./history") }}>
                            <View style={styles.opcaoMenu}>
                                <View style={styles.optionIcon}>
                                    <Octicons
                                        name="history"
                                        color={theme.iconColor}
                                        size={25}
                                    />
                                </View>

                                <Text style={[styles.textOptions, { color: theme.text }]}>Histórico</Text>
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
        backgroundColor: Colors.black,
        alignItems: "center",
    },
    scroll: {
        backgroundColor: Colors.background,
        width: "100%",
        maxWidth: 600
    },
    contentStyleScroll: {
        color: Colors.blue,
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
        color: Colors.blue,
    },
    subTitleText: {
        fontFamily: "Lexend-Regular",
        color: Colors.gray,
        fontSize: 18,
    },
    settings: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 10,

    }, validityBox: {

        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    buttonsBox: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    requestBox: {
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: Colors.gray,
        borderRadius: 20,
        width: "47%",
        gap: 5,
    },
    singleBox: {
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: Colors.red2,
        borderRadius: 20,
        width: "47%",
        gap: 5,
    },
    buttonsText: {
        fontFamily: "Lexend-SemiBold",
        color: Colors.white,
    },
    dashboardBox: {
        paddingTop: 20,
        paddingBottom: 30,
    },
    title: {
        fontSize: 22,
        fontFamily: "Lexend-SemiBold",
        color: Colors.blue,
        marginBottom: 15,
    },
    dashboardRowItens: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dashboardItem: {
        backgroundColor: Colors.white,
        padding: 24,
        width: "48%",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    dashboardItemText: {
        fontSize: 16,
        color: Colors.blue,
        fontFamily: "Lexend-Regular",
    },
    dashboardItemValue: {
        fontSize: 22,
        fontFamily: "Lexend-Bold",
        color: Colors.blue,
    },
    dashboardLargeItem: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginTop: 15,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    containerAcessoRapido: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    opcaoMenu: {
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
        gap: 20,
    },
    textOptions: {
        color: Colors.gray,
        fontSize: 16,
        fontFamily: "Lexend-Regular",
    },
    optionIcon: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: Colors.gray,
        borderWidth: 2,
        borderRadius: 10,
        width: 40,
        height: 40,
    }
})