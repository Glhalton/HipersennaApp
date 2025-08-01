
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function signup() {
    const [nomeCompleto, setNomeCompleto] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [telefone, setTelefone] = React.useState("");
    const [endereco, setEndereco] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const criarUsuario = async () => {
        try {
            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/cadastro/criarusuario.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nomeCompleto, email, telefone, endereco, username, password })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                Alert.alert("Sucesso", resultado.mensagem);
                router.push("/");
            } else {
                Alert.alert("Erro", resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possível conectar ao servidor");
        }
    };

    return (
        <View style={styles.container}>

            <Input
                placeholder="Nome completo"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
            />
            <Input
                placeholder="Email"
                inputMode="email"
                value={email}
                onChangeText={setEmail}
                
            />
            <Input
                placeholder="Telefone"
                inputMode="tel"
                keyboardType="phone-pad"
                maxLength={11}
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
                autoCapitalize="none"
            />

            <Input
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
            />

            <View style={styles.containerBotao}>
                <LargeButton title="Criar usuario" onPress={criarUsuario} />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 20,
    },
    containerBotao: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 50,
    }
})