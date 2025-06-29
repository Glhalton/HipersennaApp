import React from "react";
import { View, Text, TextInput, Image } from "react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Input } from "@/components/input";
import { Button } from "@react-navigation/elements";
import { LargeButton } from "@/components/largeButton";
import { TopBar } from "@/components/topBar";

import { router } from "expo-router";

export default function Vistoria(){
    const botaoVoltar = () => {
        router.back();
    }

    const botaoEntrar = () => {
        router.push("/vistoriaFormulario");
    }

    return (
        <View style={styles.container}>
            <TopBar text="Vistoria"/>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>
                    Filial
                </Text>
                <Input placeholder="Selecione a filial desejada"/>
                <Text style={styles.text}>
                    Data
                </Text>
                <Input placeholder="Insira a data desejada"/>         
                   
            </View>
            <LargeButton  title="Entrar" onPress={botaoEntrar}/>    
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        alignItems:"center"
    },
    text:{
        fontSize: 16,
        color: "#205072",
        paddingLeft: 30,
        width: "100%"
        
    },
    inputContainer:{
        width: "100%",
        alignItems:"center",
        paddingBottom: 15   
    },

})