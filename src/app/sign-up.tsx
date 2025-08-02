
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React from "react";
import { Text, Alert, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";

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
            Alert.alert("Erro", "Não foi possível conectar ao servidor" + erro);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View>
                    <Text style={styles.label}>Nome Completo *</Text>
                    <Input
                        placeholder="Digite o seu nome"
                        value={nomeCompleto}
                        onChangeText={setNomeCompleto}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Email</Text>
                    <Input
                        placeholder="Digite o seu email"
                        inputMode="email"
                        value={email}
                        onChangeText={setEmail}

                    />
                </View>
                <View>
                    <Text style={styles.label}>Telefone</Text>
                    <Input
                        placeholder="Digite o seu telefone"
                        inputMode="tel"
                        keyboardType="phone-pad"
                        maxLength={11}
                        value={telefone}
                        onChangeText={setTelefone}
                    />
                </View>
                <View>
                    <Text style={styles.label}>Endereço</Text>
                    <Input
                        placeholder="Digite o seu Endereço"
                        value={endereco}
                        onChangeText={setEndereco}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Username *</Text>
                    <Input
                        placeholder="Digite o seu usuário"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View>
                    <Text style={styles.label}>Senha *</Text>
                    <Input
                        placeholder="Digite a sua senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.containerBotao}>
                    <LargeButton title="Criar usuario" onPress={criarUsuario} />
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    form: {
        flex: 1,
        paddingHorizontal: 14,
        paddingTop: 20,
    },
    label: {
        color: colors.blue,
        marginBottom: 4,
        fontWeight: "bold"
    },
    containerBotao: {
        marginTop: 30
    }
})