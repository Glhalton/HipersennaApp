import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";

export default function ProductData() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const product = useLocalSearchParams();
  const [inativity, setInativity] = useState("");
  const [availableStock, setAvailableStock] = useState(0);
  const [availableStockDp6, setAvailableStockDp6] = useState(0);

  const copyText = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const verifyInativity = (value: any) => {
    if (value == undefined) {
      setInativity("ATIVO");
    } else {
      setInativity("INATIVO");
    }
  };

  const calculateAvailableStock = (
    total: number,
    reserved: number,
    blocked: number,
    totaldp6: number,
    reserveddp6: number,
    blockeddp6: number,
  ) => {
    const availableStock = total - (reserved + blocked);
    const availableStockDP6 = totaldp6 - (reserveddp6 + blockeddp6);
    setAvailableStock(availableStock);
    setAvailableStockDp6(availableStockDP6);
  };

  useEffect(() => {
    verifyInativity(product.dtinativo);
    calculateAvailableStock(
      Number(product.qtestger),
      Number(product.qtreserv),
      Number(product.qtbloqueada),
      Number(product.qtestgerdp6),
      Number(product.qtreservdp6),
      Number(product.qtbloqueadadp6),
    )
    console.log(product.dtinativo);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.main}>
        <View style={styles.bigItemProductData}>
          <Text style={[styles.label, { color: theme.text }]}>Descrição:</Text>
          <Text style={styles.text}>{product.descricao}</Text>
        </View>
        <View style={styles.bigItemProductData}>
          <View style={styles.copyBox}>
            <Text style={[styles.label, { color: theme.text }]}>Cód. de Barras:</Text>
            <TouchableOpacity
              onPress={() => {
                copyText(String(product.codAuxiliar));
              }}
            >
              <Ionicons name="copy-outline" size={22} />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>{product.codAuxiliar}</Text>
        </View>
        <View style={styles.rowBox}>
          <View style={styles.itemProductData}>
            <View style={styles.copyBox}>
              <Text style={[styles.label, { color: theme.text }]}>Cód. Interno:</Text>
              <TouchableOpacity
                onPress={() => {
                  copyText(String(product.codProd));
                }}
              >
                <Ionicons name="copy-outline" size={22} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.text, { color: theme.text }]}>{product.codProd}</Text>
          </View>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Situação:</Text>
            <Text style={[styles.text, { color: theme.text }]}>{inativity}</Text>
          </View>
        </View>
        <View style={styles.rowBox}>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Varejo:</Text>
            <Text style={[styles.text, { color: theme.text }]}>R$ {product.precovenda}</Text>
          </View>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Atacado:</Text>
            <Text style={[styles.text, { color: theme.text }]}>R$ {product.precovendaatac}</Text>
          </View>
        </View>
        <View style={styles.rowBox}>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Varejo Futuro:</Text>
            <Text style={[styles.text, { color: theme.text }]}>R$ {product.precotabela}</Text>
          </View>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Atacado Futuro:</Text>
            <Text style={[styles.text, { color: theme.text }]}>R$ {product.precotabelaatac}</Text>
          </View>
        </View>
        <View style={styles.rowBox}>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Embalagem:</Text>
            <Text style={[styles.text, { color: theme.text }]}>{product.embalagem}</Text>
          </View>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Unidade:</Text>
            <Text style={[styles.text, { color: theme.text }]}>{product.unidade}</Text>
          </View>
        </View>
        <View style={styles.rowBox}>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Est. Disponível:</Text>
            <Text style={[styles.text, { color: theme.text }]}>{availableStock}</Text>
          </View>
          <View style={styles.itemProductData}>
            <Text style={[styles.label, { color: theme.text }]}>Est. Disponível DP6:</Text>
            <Text style={[styles.text, { color: theme.text }]}>{availableStockDp6}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  main: {
    gap: 10,
    // backgroundColor: "white",
    // borderRadius: 12,
  },
  bigItemProductData: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 5,
    // backgroundColor: "white",
    borderRadius: 12,
  },
  rowBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  itemProductData: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    // backgroundColor: "white",
    borderRadius: 12,
    gap: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  text: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
  },
  copyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
