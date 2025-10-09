import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
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
import { Input } from "../components/input";
import { LargeButton } from "../components/largeButton";
import ModalAlert from "../components/modalAlert";
import { Colors } from "../constants/colors";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const appVersion = Constants.expoConfig?.version

  const { visible, alertData, hideAlert, showAlert } = useAlert();
  const { isLoading, checkSession, login } = useAuth(url!, showAlert);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const logos = {
    light: require("../../assets/images/hipersenna-red-logo.png"),
    dark: require("../../assets/images/hipersenna-white-logo.png"),
  };

  useEffect(() => {
    checkSession();
  }, [])

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
            onPress={() => (login(username, password))}
            loading={isLoading}
            backgroundColor={theme.red}
          />
        </View>
      </View>
      <View style={styles.footerBox}>
        <Text style={[styles.footerText, { color: theme.text }]}>
          Versão: {appVersion}
        </Text>
      </View>

      {alertData && (
        <ModalAlert
          visible={visible}
          onRequestClose={hideAlert}
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
  footerBox: {
    padding: 20
  },
  footerText: {
    fontFamily: "Lexend-Regular",
  }
});
