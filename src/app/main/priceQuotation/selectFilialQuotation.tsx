import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Keyboard, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../../components/buttonComponent";
import { DropdownInput } from "../../../components/dropdownInput";
import { Input } from "../../../components/input";
import ModalAlert from "../../../components/modalAlert";
import { Colors } from "../../../constants/colors";
import { useAlert } from "../../../hooks/useAlert";

type Concurrent = {
  codConc: string;
  concorrente: string;
  ativo: string | null;
};

export default function SelectFilialQuotation() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const [concurrentInput, setConcurrentInput] = useState("");
  const [concurrentData, setConcurrentData] = useState<Concurrent>();

  const [branchId, setBranchId] = useState("");
  const branches = [
    { label: "1 - Matriz", value: "1" },
    { label: "2 - Faruk", value: "2" },
    { label: "3 - Carajás", value: "3" },
    { label: "4 - VS10", value: "4" },
    { label: "5 - Xinguara", value: "5" },
    { label: "6 - DP6", value: "6" },
    { label: "7 - Cidade Jardim", value: "7" },
  ];

  const searchConcurrent = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(`${url}/concurrents?id=${concurrentInput}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setConcurrentData(responseData[0]);
        Keyboard.dismiss();
      } else if (response.status == 404) {
        showAlert({
            title: "Erro!",
            text: "Concorrente não encontrado",
            icon: "error-outline",
            color: Colors.red,
            iconFamily: MaterialIcons,
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Informe os dados da cotação:</Text>
      </View>

      <View style={styles.main}>
        <View>
          <DropdownInput label={"Filial:"} value={branchId} items={branches} onChange={(val) => setBranchId(val)} />
        </View>

        <View style={styles.productSearchBox}>
          <View style={styles.productInputBox}>
            <Input
              label="Cod. concorrente:"
              placeholder="Cod. Concorrente"
              keyboardType="numeric"
              value={concurrentInput}
              onChangeText={(concurrentInput) => setConcurrentInput(concurrentInput.replace(/[^0-9]/g, ""))}
            />
          </View>

          <TouchableOpacity
            style={[styles.searchButtonComponent, { backgroundColor: theme.button }]}
            onPress={() => {
              searchConcurrent();
            }}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Ionicons name="search" size={25} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
        {concurrentData && (
          <View style={[styles.concurrentDataBox, ]}>
            <View>
              <Text>Nome:</Text>
              <Text style={[styles.text, { fontSize: 18 }]}>{concurrentData?.concorrente}</Text>
            </View>
            <View style={styles.codeActivityBox}>
              <View style={styles.rowBox}>
                <Text>Código:</Text>
                <Text style={styles.text}>{concurrentData?.codConc}</Text>
              </View>
              <View style={styles.rowBox}>
                <Text>Ativo:</Text>
                <Text style={styles.text}>{concurrentData?.ativo}</Text>
              </View>
            </View>
          </View>
        )}
        {branchId && concurrentData && (
          <ButtonComponent
            text="Continuar"
            onPress={() => {
              router.replace("./quotationForm");
            }}
            style={{ backgroundColor: theme.button }}
          />
        )}
      </View>

      {alertData && (
        <ModalAlert
          onRequestClose={hideAlert}
          visible={visible}
          ButtonComponentPress={hideAlert}
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
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    color: Colors.blue,
    fontFamily: "Roboto-Bold",
  },
  main: {
    gap: 20,
  },
  productSearchBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 15,
  },
  productInputBox: {
    flex: 1,
  },
  searchButtonComponent: {
    width: "15%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  searchText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  rowBox: {
    flex: 1,
  },
  label: { fontSize: 16 },
  text: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 16,
  },
  codeActivityBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  concurrentDataBox: {
    gap: 15,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
});
