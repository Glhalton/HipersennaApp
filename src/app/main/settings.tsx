import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Alert, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LargeButton } from "../../components/largeButton";
import { Colors } from "../../constants/colors";
import { employeeDataStore } from "../../store/employeeDataStore";

export default function settings() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const url = process.env.EXPO_PUBLIC_API_URL;

  const name = employeeDataStore((state) => state.name);
  const username = employeeDataStore((state) => state.username);
  const winthorId = employeeDataStore((state) => state.winthorId);
  const id = employeeDataStore((state) => state.userId);
  const branchId = employeeDataStore((state) => state.branchId);
  const accessLevel = employeeDataStore((state) => state.accessLevel);

  const signOut = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${url}/users/signout`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData.message)
        await AsyncStorage.removeItem("token");
        router.dismissAll();
        router.replace("/")
      } else {
        Alert.alert("Erro", "Erro ao sair do aplicativo:")
      }
    } catch (error: any) {
      Alert.alert("Erro", `Não foi possível conectar ao servidor: ${error.message}`)
    }
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.contentBox}>
        <Text style={[styles.title, { color: theme.title }]}>
          Dados do Usuário:
        </Text>
        <View
          style={[styles.userDataBox, { backgroundColor: theme.uiBackground }]}
        >
          <Text style={[styles.label, { color: theme.title }]}>
            Id:{" "}
            <Text style={[styles.text, { color: theme.text }]}>{id}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.title }]}>
            Nome:{" "}
            <Text style={[styles.text, { color: theme.text }]}>{name}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.title }]}>
            Username:{" "}
            <Text style={[styles.text, { color: theme.text }]}>{username}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.title }]}>
            Código do winthor:{" "}
            <Text style={[styles.text, { color: theme.text }]}>{winthorId}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.title }]}>
            Filial:{" "}
            <Text style={[styles.text, { color: theme.text }]}>{branchId}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.title }]}>
            Nivel de Acesso:{" "}
            <Text style={[styles.text, { color: theme.text }]}>
              {accessLevel}
            </Text>
          </Text>
        </View>

        <View style={styles.button}>
          <LargeButton
            text="Sair do aplicativo"
            onPress={() => { signOut() }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentBox: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontFamily: "Lexend-Bold",
    fontSize: 20,
    paddingBottom: 10,
  },
  userDataBox: {
    padding: 20,
    borderRadius: 20,
  },
  label: {
    fontFamily: "Lexend-Bold",
    fontSize: 16,
  },
  text: {
    fontFamily: "Lexend-Regular",
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});
