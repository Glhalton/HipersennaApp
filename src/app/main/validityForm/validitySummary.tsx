import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { postValidityDataStore } from "../../../../store/postValidityDataStore";
import { LargeButton } from "../../../components/largeButton";
import ModalAlert from "../../../components/modalAlert";

export default function ValiditySummary() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [alertTitle, setAlertTitle] = useState("");
  const [alertText, setAlertText] = useState("");
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [modalIcon, setModalIcon] = useState("");
  const [alertIconColor, setAlertIconColor] = useState("");

  const validityData = postValidityDataStore((state) => state.validity);
  const productsList = postValidityDataStore((state) => state.productsList);
  const removeProduct = postValidityDataStore((state) => state.removeProduct);
  const resetProducts = postValidityDataStore(
    (state) => state.resetProductsList,
  );

  const postValidity = async () => {

    if (productsList.length === 0) {
      setAlertTitle("Erro!");
      setAlertText("Nenhum produto para ser adicionado!");
      setModalIcon("error-outline");
      setAlertIconColor(Colors.red);
      setModalAlertVisible(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch("http://10.101.2.7:3333/validities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          validity: validityData,
          products: productsList,
        }),
      });

      const responseData = await response.json();

      if (responseData.createdValidity) {
        setAlertTitle("Sucesso!");
        setAlertText(responseData.message);
        setModalIcon("check-circle-outline");
        setAlertIconColor("#13BE19");
        setModalAlertVisible(true);
      } else {
        setAlertTitle("Erro!");
        setAlertText(responseData.message);
        setModalIcon("error-outline");
        setAlertIconColor(Colors.red);
        setModalAlertVisible(true);
      }
    } catch (erro) {
      setAlertTitle("Erro");
      setAlertText(`Não foi possível conectar ao servidor: ${erro}`);
      setModalIcon("error-outline");
      setAlertIconColor(Colors.red);
      setModalAlertVisible(true);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <View style={styles.cardsBox}>
        <View style={styles.filialTitleBox}>
          <Text style={[styles.filialTitleText, { color: theme.title }]}>
            Filial: {validityData.branch_id}
          </Text>
        </View>

        <FlatList
          data={productsList}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <View
              style={[styles.card, { backgroundColor: theme.uiBackground }]}
            >
              <Text style={[styles.cardTitleText, { color: theme.title }]}>
                #{index + 1} - {item.description}
              </Text>
              <View style={styles.productDataBox}>
                <View>
                  <Text style={[styles.productDataText, { color: theme.text }]}>
                    <Text style={[styles.label, { color: theme.title }]}>
                      Código:
                    </Text>{" "}
                    {item.product_cod}
                  </Text>
                  <Text style={[styles.productDataText, { color: theme.text }]}>
                    <Text style={[styles.label, { color: theme.title }]}>
                      Validade:
                    </Text>{" "}
                    {new Date(item.validity_date).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.productDataText, { color: theme.text }]}>
                    <Text style={[styles.label, { color: theme.title }]}>
                      Quantidade:
                    </Text>{" "}
                    {item.quantity}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: theme.red }]}
                onPress={() => removeProduct(index)}
              >
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={styles.insertButton}>
          <LargeButton
            text="Salvar dados"
            onPress={postValidity}
            backgroundColor={theme.red}
          />
        </View>
      </View>

      <ModalAlert
        visible={modalAlertVisible}
        buttonPress={() => {
          setModalAlertVisible(false);
          resetProducts();
          router.back();
        }}
        title={alertTitle}
        text={alertText}
        iconCenterName={modalIcon}
        IconCenter={MaterialIcons}
        iconColor={alertIconColor}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filialTitleBox: {
    paddingBottom: 20,
  },
  filialTitleText: {
    fontFamily: "Lexend-Bold",
    fontSize: 30,
    color: Colors.blue,
  },
  cardsBox: {
    paddingHorizontal: 14,
    paddingTop: 10,
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTitleText: {
    fontSize: 16,
    fontFamily: "Lexend-Bold",
    marginBottom: 6,
    color: Colors.blue,
  },
  productDataBox: {
    flexDirection: "row",
    gap: 60,
    marginBottom: 8,
  },
  label: {
    fontFamily: "Lexend-Regular",
    color: Colors.blue,
  },
  productDataText: {
    fontFamily: "Lexend-Regular",
    color: Colors.gray,
  },
  removeButton: {
    backgroundColor: "#f72929ff",
    padding: 5,
    borderRadius: 7,
    alignItems: "center",
  },
  removeText: {
    color: "white",
    fontFamily: "Lexend-Bold",
  },
  insertButton: {
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
  },
});
