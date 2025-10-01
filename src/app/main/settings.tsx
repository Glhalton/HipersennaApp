import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { employeeDataStore } from "../../../store/employeeDataStore";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [branchId, setBranchId] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [winthorId, setWinthorId] = useState("");

  const getUserData = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      const response = await fetch("http://10.101.2.7:3333/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        setId(responseData.id);
        setName(responseData.name);
        setUsername(responseData.username);
        setBranchId(responseData.branch_id);
        setAccessLevel(responseData.access_level);
        setWinthorId(responseData.winthor_id);
      } else {
        Alert.alert("Erro", "Erro ao consultar dados do usuário!")
      }
    } catch (error: any) {
      console.log(`Não foi possível se conectar ao servidor: ${error}`)
    }

  }

  const signOut = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `http://10.101.2.7:3333/auth/signout`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        },
      );

      const responseData = await response.json();

      if (responseData.message) {
        console.log(responseData.message)
        await AsyncStorage.removeItem("token");
        router.dismissAll();
        router.replace("/")
      } else {
        Alert.alert("Erro", "Erro ao sair do aplicativo")
      }

    } catch (error: any) {
      Alert.alert("Erro", error.message)
    }

  }

  useEffect(() => {
    getUserData();
  }, [])

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
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
