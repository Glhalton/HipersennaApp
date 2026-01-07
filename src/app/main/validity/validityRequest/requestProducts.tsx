import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { validityDataStore } from "@/store/validityDataStore";
import React from "react";
import { FlatList, useColorScheme, View } from "react-native";

export default function RequestProducts() {
  const colorScheme = useColorScheme() ?? "light";

  const productsList = validityDataStore((state) => state.validity.products);

  return (
    <Screen>
      <View className="flex-1">
        <FlatList
          data={productsList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className="border-b border-gray-300 py-3">
              <RowItem label={`${item.product_code} - `} value={item.description} />
              <RowItem label="Cod. auxiliar: " value={item.auxiliary_code} />
              <RowItem label="Dt. vencimento: " value={new Date(item.validity_date).toLocaleDateString("pt-BR")} />
            </View>
          )}
        />
      </View>
    </Screen>
  );
}
