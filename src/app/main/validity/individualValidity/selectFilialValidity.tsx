import Button from "@/components/UI/Button";
import { DropDownInput } from "@/components/UI/DropDownInput";
import { Screen } from "@/components/UI/Screen";
import { branchesStore } from "@/store/branchesStore";
import { validityDataStore } from "@/store/validityDataStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, useColorScheme, View } from "react-native";

export default function SelectFilialValidity() {
  const colorScheme = useColorScheme() ?? "light";

  const setValidity = validityDataStore((state) => state.addValidity);
  const resetValidity = validityDataStore((state) => state.resetValidityData);
  const resetList = validityDataStore((state) => state.resetProductsList);

  const [branchId, setBranchId] = useState("");
  const branches = branchesStore((state) => state.branches);
  const dropdownItems = branches.map((item) => ({
    label: item.description,
    value: String(item.id),
  }));

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
    <Screen>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View className="gap-6">
        <Text className="font-bold text-2xl text-center">Selecione a filial desejada:</Text>

        <View className="gap-8">
          <View>
            <DropDownInput value={branchId} items={dropdownItems} onChange={(val) => setBranchId(val)} />
          </View>
          {branchId && (
            <Button
              text="Continuar"
              onPress={() => {
                addValidity();
                router.replace("./validityForm");
              }}
            />
          )}
        </View>
      </View>
    </Screen>
  );
}
