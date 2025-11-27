import React from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { validityDataStore } from "../../../store/validityDataStore";

export default function historyProducts() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const products = validityDataStore((state) => state.validity.products);

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
              <Text style={[styles.label, { color: theme.title }]}>{index + 1}°</Text>
              <View style={styles.rowBox}>
                <Text style={[styles.label, { color: theme.title }]}>{item.product_code}: </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>{item.description}</Text>
              </View>
              <View style={styles.rowBox}>
                <Text style={[styles.label, { color: theme.title }]}>Cod. auxiliar: </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>{item.auxiliary_code}</Text>
              </View>
              <View style={styles.rowBox}>
                <Text style={[styles.label, { color: theme.title }]}>Dt. vencimento: </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  {new Date(item.validity_date).toLocaleDateString("pt-BR")}
                </Text>
              </View>
              <View style={styles.rowBox}>
                <Text style={[styles.label, { color: theme.title }]}>Quantidade: </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>{item.quantity}</Text>
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
    padding: 20,
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
});
