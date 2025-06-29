import React from "react";

import { View, Text } from "react-native";
import { TopBar } from "@/components/topBar";
import { StyleSheet } from "react-native";

export default function VistoriaFormulario(){
        return(
            <View style={styles.container}>
               <TopBar text="Vistoria"/> 
                <Text>
                    teste 2
                </Text>
            </View>
        )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    }
})