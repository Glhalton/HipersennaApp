import { ButtonComponent } from "@/components/buttonComponent";
import { DropdownInput } from "@/components/dropdownInput";
import { Colors } from "@/constants/colors";
import { validityDataStore } from "@/store/validityDataStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectFilialValidity() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const setValidity = validityDataStore((state) => state.addValidity);
  const resetValidity = validityDataStore((state) => state.resetValidityData);
  const resetList = validityDataStore((state) => state.resetProductsList);

  const [branchId, setBranchId] = useState("");
  const branches = [
    { label: "1 - Matriz", value: "1" },
    { label: "2 - Faruk", value: "2" },
    { label: "3 - Carajás", value: "3" },
    { label: "4 - VS10", value: "4" },
    { label: "5 - Xinguara", value: "5" },
    { label: "6 - DP6", value: "6" },
    { label: "7 - Cidade Jardim", value: "7" },
    { label: "8 - Canaã dos Carajás", value: "8" },
  ];

  //Cria a validade com request = null, pois é avulsa
  function addValidity() {
    setValidity({
      branch_id: Number(branchId),
      request_id: null,
      products: [],
    });
  }

  useEffect(() => {
    resetList();
    resetValidity();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Selecione a filial desejada:</Text>
      </View>

      <View style={styles.main}>
        <View>
          <DropdownInput label={"Filial:"} value={branchId} items={branches} onChange={(val) => setBranchId(val)} />
        </View>
        {branchId && (
          <ButtonComponent
            style={{ backgroundColor: theme.button }}
            text="Continuar"
            onPress={() => {
              addValidity();
              router.replace("./validityForm");
            }}
          />
        )}
      </View>
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
    paddingVertical: 30,
  },
  title: {
    fontSize: 26,
    color: Colors.blue,
    fontFamily: "Roboto-Bold",
    textAlign: "center",
  },
  main: {
    gap: 20,
  },
});
