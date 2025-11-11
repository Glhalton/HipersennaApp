import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalAlert from "../../../components/modalAlert";
import { Colors } from "../../../constants/colors";
import { useAlert } from "../../../hooks/useAlert";
import { useUserData } from "../../../hooks/useUserData";
import { employeeDataStore } from "../../../store/employeeDataStore";


export default function Home() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;

  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const name = employeeDataStore((state) => state.name);
  const firstName = name?.split(" ")[0];

  const { isLoading, requests, validities } = useUserData(url!, showAlert);

  const countValidade = validities.length;
  const countRequests = requests.length;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.iconColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentStyleScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.helloText, { color: theme.title }]}>Olá, {firstName}</Text>
            <Text style={[styles.text, { color: theme.text }]}>GHSApp</Text>
          </View>
        </View>

        <View style={styles.main}>
          <View style={[styles.validityBox, { backgroundColor: theme.uiBackground }]}>
            <Text style={[styles.title, { color: theme.title }]}>Vistoria</Text>
            <View style={styles.buttonsBox}>
              <TouchableOpacity
                style={[styles.requestBox, { backgroundColor: theme.gray }]}
                onPress={() => {
                  // router.push("./validityForm/selectRequest");
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 2,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    width: "50%",
                    height: "30%",
                  }}
                >
                  <FontAwesome6 name="lock" size={25} color={Colors.white} />
                </View>
                <FontAwesome6 name="envelope-open-text" size={50} color="#777d83ff" />
                <Text style={[styles.buttonsText, { color: "#777d83ff" }]}>Solicitação</Text>
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
            <Text style={[styles.title, { color: theme.title }]}>Estatísticas</Text>
            <View style={[styles.dashboardRowItens]}>
              <View style={[styles.dashboardItem, { backgroundColor: theme.uiBackground }]}>
                <Text style={[styles.text, { color: theme.text }]}>Nº Vistorias realizadas: </Text>
                <Text style={[styles.title, { color: theme.text }]}>{countValidade}</Text>
              </View>
              <View style={[styles.dashboardItem, { backgroundColor: theme.uiBackground }]}>
                <Text style={[styles.text, { color: theme.text }]}>Nº Vistorias pendentes:</Text>
                <Text style={[styles.title, { color: theme.text }]}>{countRequests}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.containerAcessoRapido, { backgroundColor: theme.uiBackground }]}>
            <Text style={[styles.title, { color: theme.title }]}>Acesso rápido</Text>
            <View>
              {/* <TouchableOpacity
                onPress={() => {
                  router.push("/main/validityRequest/requests");
                }}
                style={styles.optionButton}
              >
                <View style={styles.opcaoMenu}>
                  <View style={styles.optionIcon}>
                    <Octicons name="checklist" color={theme.iconColor} size={25} />
                  </View>
                  <Text style={[styles.text, { color: theme.text }]}>Vistorias à fazer</Text>
                </View>
              </TouchableOpacity> */}
              
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
                  <Text style={[styles.text, { color: theme.text }]}>Histórico</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {alertData && (
        <ModalAlert
          visible={visible}
          buttonPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
          iconColor={alertData.color}
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
  scroll: {
    backgroundColor: Colors.background,
    width: "100%",
    maxWidth: 600,
  },
  contentStyleScroll: {
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
    maxWidth: 300,
    fontSize: 20,
    fontFamily: "Roboto-SemiBold",
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 15,
  },
  settings: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  main: {
    
  },
  validityBox: {
    padding: 20,
    borderRadius: 20,
    gap: 15,
  },
  buttonsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requestBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray,
    borderRadius: 20,
    height: 115,
    width: "47%",
    gap: 5,
  },
  singleBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.red2,
    borderRadius: 20,
    width: "47%",
    height: 115,
    gap: 5,
  },
  buttonsText: {
    fontFamily: "Roboto-Regular",
    color: Colors.white,
  },
  dashboardBox: {
    paddingTop: 20,
    paddingBottom: 30,
    gap: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: "Roboto-Bold",
  },
  dashboardRowItens: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dashboardItem: {
    backgroundColor: Colors.white,
    padding: 24,
    width: "47%",
    borderRadius: 12,
  },
  containerAcessoRapido: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    gap: 15
  },
  opcaoMenu: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    gap: 20,
  },
  optionButton: {
    borderTopWidth: 0.4,
    borderColor: Colors.gray,
  },
  optionIcon: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 40,
    height: 40,
  },
});
