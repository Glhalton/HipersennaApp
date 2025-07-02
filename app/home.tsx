import React from "react";
import { Text, View, StyleSheet, Image } from "react-native"
import { router } from "expo-router";

import {LargeButton} from "../components/largeButton";
import { SmallButton } from "@/components/smallButton";

export default function Home(){
    const botaoAddPress = () => {
        router.push("/vistoria");
    }

    const botaoHistoricPress = () => {
        router.push("/historico");
    }
    

    return(
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Validade</Text>
                <Image style={styles.engrenagemImg} source={require("../assets/images/Engrenagem.png")}/>
            </View>

            <View style={styles.containerBemVindo}>
                <Text style={styles.tituloBemVindo}>
                    Bem vindo de volta, XXX
                </Text>
                <View style={styles.containerbuttons}>
                    <SmallButton title="Add" onPress={botaoAddPress}/>
                    <SmallButton title="Histórico" onPress={botaoHistoricPress}/>
                </View>
            </View>

            <View style={styles.containerDashboard}>
                <Text style={styles.titulo}>
                    Dashboard
                </Text>
                <View style={styles.dashboardRowItens}>
                    <View style={styles.dashboardItem}>
                        <Text style={styles.dashboardItemText}>Total de {"\n"}vistorias: </Text>
                        <Text style={styles.dashboardItemValue}>12</Text>
                    </View>
                    <View style={styles.dashboardItem}>
                        <Text style={styles.dashboardItemText}>Vencerão em {"\n"}breve</Text>
                        <Text style={styles.dashboardItemValue}>
                            2
                        </Text>
                    </View>
                </View>
                <View style={styles.dashboardLargeItem}>
                    <Text style={styles.dashboardItemText}>Vencidos </Text>
                    <Text style={styles.dashboardItemValue}>1</Text>
                </View>
            </View>
            <View style={styles.containerAcessoRapido}>

            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "flex-start",
        color:"#205072",
    },
    header:{
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 50,
    },
    headerText:{
        fontSize: 18,
        fontWeight: "bold",
        color: "#205072",
        paddingLeft: 30
    },
    engrenagemImg:{
        marginRight:30,
    },
    containerBemVindo:{
        width: "100%"
    },
    tituloBemVindo:{
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        paddingBottom: 20,
        paddingTop: 20,
        color:"#205072",
    },
    containerbuttons:{
        flexDirection: "row", 
        justifyContent:"space-around", 
        width: "100%",
    },
    containerDashboard:{
        width: "100%",
    },
    dashboardRowItens:{
        flexDirection: "row",
        justifyContent: "space-around"
    },
    dashboardItem:{
        backgroundColor:"#F4F6F8",
        height: 134,
        width: 171,
        borderRadius: 12,
        justifyContent: "center",
    },
    dashboardItemText:{
        fontSize: 16,
        color: "#205072",
        paddingLeft: 20,
        
    },
    dashboardItemValue:{
        fontSize: 24,
        fontWeight: "bold",
        color: "#205072",
        paddingLeft: 20,
    },
    dashboardLargeItem:{
        backgroundColor:"#F4F6F8",
        height: 134,
        width: 374,
        borderRadius: 12,
        justifyContent: "center",
        marginTop: 20,
        marginLeft: 20,

    },
    containerAcessoRapido:{

    },

    titulo:{
        fontSize: 22,
        fontWeight: "bold",
        color: "#205072",
        padding: 30
    }
})