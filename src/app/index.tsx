import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { Input } from "../components/input";
import { LargeButton } from "../components/largeButton";
import ModalAlert from "../components/modalAlert";

export default function Index() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getLogin = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("http://10.101.2.7:3333/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.json();

      if (responseData.token) {

        await AsyncStorage.setItem("token", responseData.token);
        console.log("Token salvo:", responseData.token);
        router.replace("/main/home");
        setUsername("");
        setPassword("");

      } else {
        setErrorTitle("Erro!");
        setErrorText(responseData.message || "Login inválido");
        setModalVisible(true);
        setPassword("");
      }
    } catch (error) {
      setErrorTitle("Erro de conexão");
      setErrorText(`Não foi possível conectar ao servidor: ${error}`);
      setUsername("");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("Nenhum token salvo, redirecionando para o login...");
        return;
      }

      const response = await fetch("http://10.101.2.7:3333/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {

        console.log("Sessão válida, redirecionando para tela inicial...");
        console.log(`Token: ${token}`)
        router.replace("/main/home");

      } else {
        console.log("Sessão inválida, limpando token");
        await AsyncStorage.removeItem("token");
      }
    } catch (error: any) {
      console.log(`Não foi possível se conectar ao servidor: ${error}`)
    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header]}>
        <Image
          source={require("../../assets/images/Logo-hipersenna100x71.png")}
        />
        <Text style={[styles.title]}>SennaApp</Text>
      </View>

      <View style={[styles.formBox, { backgroundColor: theme.background }]}>
        <View style={styles.inputBox}>
          <Input
            value={username}
            onChangeText={(username) =>
              setUsername(username.replace(/\s/g, ""))
            }
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

        <View style={styles.loginButton}>
          <LargeButton
            text="Login"
            onPress={getLogin}
            loading={isLoading}
            backgroundColor={theme.red}
          />
        </View>

      </View>

      <ModalAlert
        visible={modalVisible}
        buttonPress={() => {
          setModalVisible(false);
        }}
        title={errorTitle}
        text={errorText}
        iconCenterName="error-outline"
        IconCenter={MaterialIcons}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c0cff",
    alignItems: "center",
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
  formBox: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    maxWidth: 500,
    width: "100%",
  },
  inputBox: {},
  loginButton:{
    paddingVertical: 20,
  }


});
