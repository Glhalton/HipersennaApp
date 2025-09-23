import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { employeeDataStore } from "../../store/employeeDataStore";
import ModalAlert from "@/components/modalAlert";

export default function Index() {

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");

  const setToken = employeeDataStore((state) => state.setToken);
  const setUserId = employeeDataStore((state) => state.setUserId);
  const setName = employeeDataStore((state) => state.setName);
  const setUsernameStore = employeeDataStore((state) => state.setUsername);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  const getLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://10.101.2.7:3333/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const responseData = await response.json();

      if (responseData.token) {

        setToken(responseData.token);
        setUserId(responseData.user.id)
        setName(responseData.user.name);
        setUsernameStore(responseData.user.username)

        router.replace("/main/home");
        console.log(responseData.user)

        setUsername("");
        setPassword("");

      } else {
        setErrorTitle("Erro");
        setErrorText(responseData.error || "Login inválido");
        setModalVisible(true);
        setPassword("");
      }
    } catch (erro) {
      console.log(erro)
      setErrorTitle("Erro de conexão");
      setErrorText("Não foi possível conectar ao servidor " + erro);
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
      <View style={[styles.header,]}>
        <Image
          source={require("../../assets/images/Logo-hipersenna100x71.png")}
          style={styles.logo}
        />
        <Text style={[styles.title,]}>
          SennaApp
        </Text>
      </View>

      <View style={[styles.formBox, { backgroundColor: theme.background }]}>
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
          <Text style={[styles.forgotPasswordText, { color: theme.title }]}>
            Esqueceu a sua senha?
          </Text>
        </TouchableOpacity>

        <LargeButton
          text="Login"
          onPress={getLogin}
          loading={loading}
          backgroundColor={theme.red}
        />

        <TouchableOpacity style={styles.buttonBox} onPress={goToSignup}>
          <Text style={[styles.signupText, { color: theme.title }]}>
            Não tem uma conta? <Text style={{ color: theme.link }}>Crie agora!</Text>
          </Text>
        </TouchableOpacity>
      </View>



      <ModalAlert
        visible={modalVisible}
        buttonPress={() => { setModalVisible(false) }}
        title={errorTitle}
        text={errorText}
        iconCenterName="error-outline"
        IconCenter={MaterialIcons}

      />



    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c0cff",
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
