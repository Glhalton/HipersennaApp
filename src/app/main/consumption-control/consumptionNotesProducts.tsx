import { Colors } from "@/constants/colors";
import { consumptionProductsStore } from "@/store/consumptionProductsStore";
import React from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConsumptionNotesProducts() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const products = consumptionProductsStore((state) => state.consumptionProducts);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <View style={styles.main}>
        <FlatList
          data={products}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{}}
          renderItem={({ item, index }) => (
            <View style={[styles.card]}>
              <View style={styles.rowBox}>
                <Text style={[styles.productDataText, { color: theme.title }]}>{item.product_code} - </Text>
                <Text style={[styles.productDataText, { color: theme.title }]}>{item.description} </Text>
              </View>
              <View style={styles.rowBox}>
                <Text style={[styles.label, { color: theme.title }]}>Filial: </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>{item.branch_id}</Text>
                <Text style={[styles.productDataText, { color: theme.title }]}> | </Text>
                <Text style={[styles.label, { color: theme.title }]}>Grupo: </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  {item.hsconsumption_groups.description}
                </Text>
              </View>

              <View style={styles.rowBox}>
                <Text style={[styles.label, { color: theme.title }]}>Quantidade: </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>{item.quantity}</Text>
              </View>
              <View style={styles.rowBox}>
                <Text style={[styles.label, { color: theme.title }]}>Criado em: </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  {new Date(item.created_at).toLocaleDateString("pt-BR")}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  main: { flex: 1 },
  card: {
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    borderColor: Colors.gray,
  },
  rowBox: {
    flexDirection: "row",
  },
  codDescricaoProdutoRow: {
    flexDirection: "row",
    paddingRight: 20,
  },
  productDataText: {
    fontFamily: "Roboto-Bold",
    color: Colors.gray,
  },
  label: {
    fontFamily: "Roboto-Regular",
    color: Colors.blue,
  },
});
