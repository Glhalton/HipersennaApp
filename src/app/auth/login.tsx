import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import { FontAwesome, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { userDataStore } from "../../../store/userDataStore";

export default function Login() {

  const setUserId = userDataStore((state) => state.setUserId);
  const setNivelAcesso = userDataStore((state) => state.setNivelAcesso);
  const nivelAcesso = userDataStore((state) => state.nivelAcesso);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const getLogin = async () => {
    try {
      setLoading(true);

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
        router.replace("../main/home");
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
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    // router.push("./signup");
    // setUsername("");
    // setPassword("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/Logo-hipersenna100x71.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>
          SennaApp
        </Text>
      </View>

      <View style={styles.formBox}>
        <View style={styles.inputBox}>
          <Input
            value={username}
            onChangeText={(username) => setUsername(username.replace(/\s/g, ""))}
            label="Usuário:"
            IconRight={FontAwesome}
            iconRightName="user"
            placeholder="Digite o seu usuário"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBox}>
          <Input
            value={password}
            onChangeText={setPassword}
            label="Senha:"
            IconRight={Octicons}
            iconRightName={showPassword ? "eye-closed" : "eye"}
            placeholder="Digite a sua senha"
            secureTextEntry={showPassword}
            onIconRightPress={() => setShowPassword(!showPassword)}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>
            Esqueceu a sua senha?
          </Text>
        </TouchableOpacity>

        <LargeButton
          text="Login"
          onPress={getLogin}
          loading={loading}
        />

        <TouchableOpacity style={styles.buttonBox} onPress={goToSignup}>
          <Text style={styles.signupText}>
            Não tem uma conta? <Text style={{ color: Colors.blue, }}>Crie agora!</Text>
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
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingVertical: 60,
  },
  title: {
    fontFamily: "Lexend-Regular",
    color: "white",
    fontSize: 30,
  },
  logo: {

  },
  formBox: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: "#ffffffff",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    maxWidth: 500,
    width: "100%"
  },
  inputBox: {

  },
  forgotPasswordButton: {
    alignItems: "flex-end",
    marginBottom: 50,
  },

  forgotPasswordText: {
    color: Colors.blue,
    fontFamily: "Lexend-Regular",
  },
  buttonBox: {
    padding: 20,
    alignItems: "center",
    marginBottom: 80,
    width: "100%",
  },
  signupText: {
    color: Colors.gray,
    fontSize: 14,
    fontFamily: "Lexend-Regular",
  }
})
