import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Alert, TouchableOpacity, StyleSheet, Text, View, } from "react-native";

//Função principal que será executada no aplicativo
export default function Login() {

  //Valores Input Login
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

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
        Alert.alert("Erro", "Não foi possível conectar ao servidor " + erro  );
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

      <Text style={styles.title}>
        Bem vindo de volta!
      </Text>

      <Input
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />

      <Input
        placeholder="Senha"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        autoCapitalize="none"
      />

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

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    color: "#205072",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },
  buttonEsquecerSenha:{
    marginBottom: 50,
    left: 100
  },
  textEsquecerSenha: {
    color: "#205072",
    fontSize: 14,
  },
  botaoCadastro: {
    padding: 20,
    width: 358,
    alignItems: "center",
    marginBottom: 80,
  },
  textCadastro: {
    color: "#205072",
    fontSize: 14,
    textDecorationLine: "underline"
  }
})
