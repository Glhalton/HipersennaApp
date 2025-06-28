import React from "react";
import { Text, View, StyleSheet } from "react-native"
import { Link } from "expo-router";

import LargeButton from "../components/largeButton";

export default function Home(){
    return(
        <View style={styles.container}>
            <View style={styles.containerBemVindo}>
                <Text style={styles.titulo}>
                    Bem vindo de volta, Sophia
                </Text>
                <View style={styles.containerbuttons}>
                    <Link href={"/"} style={styles.buttonAdd}>
                        Add
                    </Link>
                    <Link href={"/"} style={styles.buttonAdd}>
                        Histórico
                    </Link>
                </View>

            </View>
            <View style={styles.containerDashboard}>

            </View>
            <View style={styles.containerAcessoRapido}>

                <LargeButton title="Teste" screenLink="./home"/>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center"
    },
    containerBemVindo:{
        alignItems: "center",
    },
    containerDashboard:{

    },
    containerAcessoRapido:{

    },
    containerbuttons:{
        flexDirection: "row", 
        justifyContent:"space-around", 
        width: 400,
                alignItems: "center",
    },
    buttonAdd:{
        backgroundColor: "#DA0100", 
        width: 84, 
        height: 40,
        justifyContent:"center",
        alignItems: "center",
        textAlign:"center",
        textAlignVertical: "center",
        borderRadius: 20,
        color: "white",
        fontSize: 14

    },
    titulo:{
        fontSize: 24,
        paddingBottom: 20,
        paddingTop: 20
    }
})