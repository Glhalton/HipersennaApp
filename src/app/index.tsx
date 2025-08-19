import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text, View, } from "react-native";
import colors from "../../constants/colors";

//Função principal que será executada no aplicativo
export default function Login() {

  //Valores Input Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Funcao verificar login
  const fazerLogin = async () => {
    try {
      const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/autenticacao/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const resultado = await resposta.json();

      if (resultado.sucesso) {

        await AsyncStorage.setItem("@user_id", resultado.userId.toString());

        router.push("/home");
        setUsername("");
        setPassword("");

      } else {
        Alert.alert("Erro", resultado.mensagem);
        setPassword("");
      }
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor " + erro);
      setUsername("");
      setPassword("");
    }
  };

  const signup = () => {
    router.push("/sign-up");
    setUsername("");
    setPassword("");
  }

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Bem vindo de volta!
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Usuário</Text>
          <Input
            placeholder="Digite o seu usuário"
            onChangeText={(username) =>setUsername(username.replace(/\s/g, ""))}
            value={username}
            autoCapitalize="none"
          />
        </View>


        <View>
          <Text style={styles.label}>Senha</Text>
          <Input
            placeholder="Digite a sua senha"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.buttonEsquecerSenha}>
          <Text style={styles.textEsquecerSenha}>
            Esqueceu a sua senha?
          </Text>
        </TouchableOpacity>


        <LargeButton title="Login" onPress={fazerLogin} />

        <TouchableOpacity style={styles.botaoCadastro} onPress={signup}>
          <Text style={styles.textCadastro}>
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>

    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontFamily: "Lexend-Bold",
    color: colors.blue,
    fontSize: 28,
  },
  form: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 30,
  },
  label: {
    color: colors.blue,
    marginBottom: 4,
    fontFamily: "Lexend-Regular",
  },
  buttonEsquecerSenha: {
    alignItems: "flex-end",
    marginBottom: 50,
  },
  botaoCadastro: {
    padding: 20,
    alignItems: "center",
    marginBottom: 80,
  },
  textEsquecerSenha: {
    color: "#205072",
    fontFamily: "Lexend-Regular",
  },
  textCadastro: {
    color: "#205072",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: "Lexend-Regular",
  }
})
