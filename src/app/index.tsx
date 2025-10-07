import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StatusBar,
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
import { useAlert } from "../hooks/useAlert";
import Constants from "expo-constants";


export default function Index() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const url = process.env.EXPO_PUBLIC_API_URL;

  const { alertData, hideAlert, showAlert, visible } = useAlert();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const appVersion = Constants.expoConfig?.version 

  const logos = {
    light: require("../../assets/images/hipersenna-red-logo.png"),
    dark: require("../../assets/images/hipersenna-white-logo.png"),
  };

  const getLogin = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${url}/auth/signin`, {
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
        showAlert({
          title: "Erro!",
          text: responseData.message,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons
        })
        setPassword("");
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error.message}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons
      })
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

      const response = await fetch(`${url}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // console.log("Sessão válida, redirecionando para tela inicial...");
        // console.log(`Token: ${token}`)
        router.replace("/main/home");
      } else {
        // console.log("Token inválido, limpando token");
        await AsyncStorage.removeItem("token");
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor:  ${error.message}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View style={[styles.header]}>
        <Image
          source={logos[colorScheme]}
          resizeMode="contain"
          style={{ height: 80, }}
        />
        <Text style={[styles.title, { color: theme.title }]}>GHSApp</Text>
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
      <View style={styles.footerBox}>
        <Text style={[styles.footerText, {color: theme.text}]}>
          Versão: {appVersion}
        </Text>
      </View>

      {alertData && (
        <ModalAlert
          visible={visible}
          buttonPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontFamily: "Lexend-SemiBold",
    color: "white",
    paddingTop: 10,
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
  loginButton: {
    paddingVertical: 20,
  },
  footerBox:{
    padding: 20
  },
  footerText:{
    fontFamily: "Lexend-Regular",
  }
});
