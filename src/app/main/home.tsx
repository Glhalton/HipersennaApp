import { FontAwesome6, Ionicons, Octicons, } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { employeeDataStore } from "../../../store/employeeDataStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  
  const setName = employeeDataStore((state) => state.setName);
  const setUsername = employeeDataStore((state) => state.setUsername);
  const setWinthorId = employeeDataStore((state) => state.setWinthorId);
  const setId = employeeDataStore((state) => state.setUserId);
  const setBranchId = employeeDataStore((state) => state.setBranchId);
  const setAccessLevel = employeeDataStore((state) => state.setAccessLevel);


  const name = employeeDataStore((state) => state.name);

  const [validities, setValidities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const countValidade = validities.length;

  const getValidities = async () => {
    try {

      setIsLoading(true);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `http://10.101.2.7:3333/validities/employee`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const responseData = await response.json();

      if (responseData.validitiesByEmployee) {
        setValidities(responseData.validitiesByEmployee);
      } else {
        Alert.alert("Erro", responseData.error);
      }
    } catch (error) {
      Alert.alert("Erro!", "Não foi possível conectar ao servidor: " + error);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    getUserData();
    getValidities();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.iconColor} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentStyleScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.helloText, { color: theme.title }]}>
              Olá, {name}
            </Text>
            <Text style={[styles.subTitleText, { color: theme.text }]}>
              SennaApp
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.settings, { backgroundColor: theme.uiBackground }]}
            onPress={() => router.push("./settings")}
          >
            <Ionicons name="settings-sharp" color={theme.iconColor} size={30} />
          </TouchableOpacity>
        </View>

        <View
          style={[styles.validityBox, { backgroundColor: theme.uiBackground }]}
        >
          <Text style={[styles.title, { color: theme.title }]}>Vistoria</Text>
          <View style={styles.buttonsBox}>
            <TouchableOpacity
              style={[styles.requestBox, { backgroundColor: theme.gray }]}
              onPress={() => {
                router.push("./validityForm/selectRequest");
              }}
            >
              <FontAwesome6
                name="envelope-open-text"
                size={50}
                color={Colors.white}
              />
              <Text style={styles.buttonsText}>Solicitação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.singleBox, { backgroundColor: theme.red }]}
              onPress={() => {
                router.push("./validityForm/selectFilialValidity");
              }}
            >
              <FontAwesome6 name="clipboard" size={50} color={Colors.white} />
              <Text style={styles.buttonsText}>Avulsa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.dashboardBox]}>
          <Text style={[styles.title, { color: theme.title }]}>Dashboard</Text>
          <View style={[styles.dashboardRowItens]}>
            <View
              style={[
                styles.dashboardItem,
                { backgroundColor: theme.uiBackground },
              ]}
            >
              <Text style={[styles.dashboardItemText, { color: theme.text }]}>
                Total de vistorias:{" "}
              </Text>
              <Text style={[styles.dashboardItemValue, { color: theme.text }]}>
                {countValidade}
              </Text>
            </View>
            <View
              style={[
                styles.dashboardItem,
                { backgroundColor: theme.uiBackground },
              ]}
            >
              <Text style={[styles.dashboardItemText, { color: theme.text }]}>
                Vencerão em breve:
              </Text>
              <Text style={[styles.dashboardItemValue, { color: theme.text }]}>
                0
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.dashboardLargeItem,
              { backgroundColor: theme.uiBackground },
            ]}
          >
            <Text style={[styles.dashboardItemText, { color: theme.text }]}>
              Vencidos:
            </Text>
            <Text style={[styles.dashboardItemValue, { color: theme.text }]}>
              0
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.containerAcessoRapido,
            { backgroundColor: theme.uiBackground },
          ]}
        >
          <Text style={[styles.title, { color: theme.title }]}>
            Acesso rápido
          </Text>
          <View>
            <TouchableOpacity
              onPress={() => router.push("/main/validityRequest/requests")}
              style={styles.optionButton}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Octicons
                    name="checklist"
                    color={theme.iconColor}
                    size={25}
                  />
                </View>

                <Text style={[styles.textOptions, { color: theme.text }]}>
                  Vistorias à fazer
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("./history");
              }}
              style={styles.optionButton}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Octicons name="history" color={theme.iconColor} size={25} />
                </View>

                <Text style={[styles.textOptions, { color: theme.text }]}>
                  Histórico
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scroll: {
    backgroundColor: Colors.background,
    width: "100%",
    maxWidth: 600,
  },
  contentStyleScroll: {
    color: Colors.blue,
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
  helloText: {
    fontSize: 22,
    fontFamily: "Lexend-SemiBold",
    color: Colors.blue,
  },
  subTitleText: {
    fontFamily: "Lexend-Regular",
    color: Colors.gray,
    fontSize: 18,
  },
  settings: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  validityBox: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  buttonsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requestBox: {
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: Colors.gray,
    borderRadius: 20,
    height: 115,
    width: "47%",
    gap: 5,
  },
  singleBox: {
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: Colors.red2,
    borderRadius: 20,
    width: "47%",
    height: 115,
    gap: 5,
  },
  buttonsText: {
    fontFamily: "Lexend-SemiBold",
    color: Colors.white,
  },
  dashboardBox: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: "Lexend-SemiBold",
    color: Colors.blue,
    marginBottom: 15,
  },
  dashboardRowItens: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dashboardItem: {
    backgroundColor: Colors.white,
    padding: 24,
    width: "48%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  dashboardItemText: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: "Lexend-Regular",
  },
  dashboardItemValue: {
    fontSize: 22,
    fontFamily: "Lexend-Bold",
    color: Colors.blue,
  },
  dashboardLargeItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 15,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  containerAcessoRapido: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  opcaoMenu: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    gap: 20,
  },
  optionButton: {
    borderTopWidth: 1,
    borderColor: Colors.gray,
  },
  textOptions: {
    color: Colors.gray,
    fontSize: 16,
    fontFamily: "Lexend-Regular",
  },
  optionIcon: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.gray,
    borderWidth: 2,
    borderRadius: 10,
    width: 40,
    height: 40,
  },
});
