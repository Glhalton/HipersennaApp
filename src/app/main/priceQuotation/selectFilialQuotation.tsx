import { router } from "expo-router";
import React, { useState } from "react";
import { StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../../components/buttonComponent";
import { DropdownInput } from "../../../components/dropdownInput";
import { Colors } from "../../../constants/colors";

export default function SelectFilialQuotation() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

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
            text="Continuar"
            onPress={() => {
              router.replace("./quotationForm");
            }}
            backgroundColor={theme.button}
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
    gap: 10,
  },
});
