import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Input } from "../components/input";
import { LargeButton } from "../components/largeButton";
import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { employeeDataStore } from "../../store/employeeDataStore";
import ModalAlert from "../components/modalAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");

  const setToken = employeeDataStore((state) => state.setToken);
  const setUserId = employeeDataStore((state) => state.setUserId);
  const setName = employeeDataStore((state) => state.setName);
  const setUsernameStore = employeeDataStore((state) => state.setUsername);
  const setAccessLevel = employeeDataStore((state) => state.setAccessLevel);
  const setBranchId = employeeDataStore((state) => state.setBranchId);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

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
        setUserId(responseData.id)
        setName(responseData.name);
        setUsernameStore(responseData.username);
        setAccessLevel(responseData.accessLevel);
        setBranchId(responseData.branchId);

        await saveSession(responseData);

        router.replace("/main/home");

        setUsername("");
        setPassword("");

      } else {
        setErrorTitle("Erro!");
        setErrorText(responseData.error || "Login inválido");
        setModalVisible(true);
        setPassword("");
      }
    } catch (error) {
      setErrorTitle("Erro de conexão");
      setErrorText("Não foi possível conectar ao servidor " + error);
      setUsername("");
      setPassword("");

    } finally {
      setLoading(false);
    }
  };

  async function saveSession(session: any) {
    await AsyncStorage.setItem("session", JSON.stringify(session));
    console.log("Salvo a sessão: " + session);
  }

  async function getSession() {
    const value = await AsyncStorage.getItem("session");
    console.log("Retornou a sessão salva: " + value)
    return value ? JSON.parse(value) : null;
  }

  useEffect(() => {
    async function checkSession() {
      const storedSession = await getSession();
      console.log("Sessão atualmente salva: " + storedSession)

      if (storedSession?.token) {
        try {
          const headers = new Headers();
          headers.set("Authorization", `Bearer ${storedSession.token}`);

          const response = await fetch("http://10.101.2.7:3333/auth/session", {
            method: "GET",
            headers: headers
          });

          const data = await response.json();

          if (data.user) {
            // sessão válida → redireciona pro app

            console.log("Sessão válida: ", data);

            router.replace("/main/home");

          } else {
            // sessão inválida → limpa e volta pro login
            await AsyncStorage.removeItem("session");
            console.log("Servidor não retornou Session: ", data)

          }
        } catch {
          console.log("catch")
        }
      } else {
        console.log("Não achou o token")
      }
    }

    checkSession();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header,]}>
        <Image
          source={require("../../assets/images/Logo-hipersenna100x71.png")}
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

        <TouchableOpacity style={styles.buttonBox} >
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
  formBox: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
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
