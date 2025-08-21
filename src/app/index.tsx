import React, { useState } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import colors from "../../constants/colors";
import { useUserDadosStore } from "../../store/useUserDadosStore";
import { SafeAreaView } from "react-native-safe-area-context";

//Função principal que será executada no aplicativo
export default function Login() {

  const setUserId = useUserDadosStore((state) => state.setUserId);
  const setNivelAcesso = useUserDadosStore((state) => state.setNivelAcesso);
  const nivelAcesso = useUserDadosStore((state) => state.nivelAcesso);

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
        setUserId(resultado.userId);
        setNivelAcesso(resultado.nivelAcesso);
        console.log(nivelAcesso)
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

  const goToSignup = () => {
    router.push("/sign-up");
    setUsername("");
    setPassword("");
  }

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Logo-hipersenna100x71.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>
          SennaApp
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Usuário</Text>
          <Input
            placeholder="Digite o seu usuário"
            onChangeText={(username) => setUsername(username.replace(/\s/g, ""))}
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

        <TouchableOpacity style={styles.botaoCadastro} onPress={goToSignup}>
          <Text style={styles.textCadastro}>
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  header: {
    alignItems: "center",
    paddingVertical: 70,

    
  },
  title: {
    fontFamily: "Lexend-Regular",
    color: "white",
    fontSize: 30,
  },
  logo:{

  },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: "#ffffffff",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
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
