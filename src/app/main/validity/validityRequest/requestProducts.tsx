import React from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { validityRequestDataStore } from "../../../../store/validityRequestDataStore";

export default function RequestProducts() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const productsList = validityRequestDataStore((state) => state.products);

  return (
    <SafeAreaView edges={["bottom"]} style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.main]}>
        <FlatList
          data={productsList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.card, {borderColor: theme.border}]}>
              <Text style={[styles.label, { color: theme.title }]}>{index + 1}°</Text>
              <View style={styles.rowBox}>
                <Text style={[styles.label, { color: theme.title }]}>
                  {item.product_cod}
                  <Text style={[styles.productDataText, { color: theme.text }]}>: {item.description}</Text>
                </Text>
              </View>
              <View>
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
  main: {},
  card: {
    borderBottomWidth: 0.5,
    paddingVertical: 8,
  },
  productDataText: {
    fontFamily: "Roboto-Regular",
    color: Colors.gray,
  },
  label: {
    fontFamily: "Roboto-SemiBold",
    color: Colors.blue,
  },
  textHeader: {
    fontFamily: "Roboto-Regular",
    color: "white",
  },
  listId: {
    padding: 10,
  },
  rowBox: {
    flexDirection: "row",
  },
});
