import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

import { LargeButton } from "@/components/largeButton";
import { Input } from "@/components/input";
import { TopBar } from "@/components/topBar";

import { router } from "expo-router";


export default function CreateProfile(){
    const [nomeCompleto, setNomeCompleto] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [telefone, setTelefone] = React.useState("");
    const [endereco, setEndereco] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

   const criarUsuario = async () => {
        try {
            const resposta = await fetch("http://10.0.2.2/API/cadastro/criarUsuario.php",{
                method : "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({nomeCompleto, email, telefone, endereco, username, password})
            });

            const resultado = await resposta.json();

            if (resultado.sucesso){
                Alert.alert("Sucesso", resultado.mensagem);
                router.push("/")
            } else{
                Alert.alert("Erro", resultado.mensagem)
            }
        } catch(erro){
            Alert.alert("Erro", "Não foi possível conectar ao servidor")
        }
   };

    return (
        <View style={styles.container}>
            <TopBar text="Criar Usuario"/>

            <Input
                placeholder="Nome completo"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
            />
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Input
                placeholder="Telefone"
                keyboardType="numeric"
                value={telefone}
                onChangeText={setTelefone}
            />
            <Input
                placeholder="Endereco"
                value={endereco}
                onChangeText={setEndereco}
            />


            <Input
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
            />

            <Input
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <View style={styles.containerBotao}>
                <LargeButton title="Criar usuario" onPress={criarUsuario}/>    
            </View>
            
            
            
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    textTitle:{

    },
    containerBotao:{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 50        
    }
})