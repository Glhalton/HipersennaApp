import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { getValidityDataStore } from "../../../store/getValidityDataStore";

export default function historyProducts() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const products = getValidityDataStore((state) => state.products);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.cardsContainer}>
        <FlatList
          data={products}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <View style={[styles.card, { backgroundColor: theme.uiBackground }]}>
              <View style={styles.listId}>
                <Text style={[styles.label, { color: theme.title }]}>{index + 1}°</Text>
              </View>
              <View style={styles.dadosItem}>
                <View style={styles.codDescricaoProdutoRow}>
                  <Text style={[styles.label, { color: theme.title }]}>
                    {item.product_cod}:{" "}
                    <Text style={[styles.productDataText, { color: theme.text }]}>{item.description}</Text>{" "}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.label, { color: theme.title }]}>
                    Cod. auxiliar: <Text style={[styles.productDataText, { color: theme.text }]}>{item.auxiliary_code}</Text>
                  </Text>
                  <Text style={[styles.label, { color: theme.title }]}>
                    Dt. vencimento:{" "}
                    <Text style={[styles.productDataText, { color: theme.text }]}>
                      {new Date(item.validity_date).toLocaleDateString("pt-BR")}
                    </Text>
                  </Text>
                  <Text style={[styles.label, { color: theme.title }]}>
                    Quantidade: <Text style={[styles.productDataText, { color: theme.text }]}>{item.quantity}</Text>
                  </Text>
                </View>
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
  },
  cardsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.gray,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  codDescricaoProdutoRow: {
    flexDirection: "row",
    paddingRight: 20,
  },
  productDataText: {
    fontFamily: "Roboto-Regular",
    color: Colors.gray,
  },
  label: {
    fontFamily: "Roboto-Bold",
    color: Colors.blue,
  },
  textHeader: {
    fontFamily: "Roboto-Regular",
    color: "white",
  },
  dadosItem: {
    paddingVertical: 10,
  },
  listId: {
    padding: 10,
  },
});
