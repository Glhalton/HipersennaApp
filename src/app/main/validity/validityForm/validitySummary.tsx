import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LargeButton } from "../../../../components/largeButton";
import ModalAlert from "../../../../components/modalAlert";
import { Colors } from "../../../../constants/colors";
import { useAlert } from "../../../../hooks/useAlert";
import { postValidityDataStore } from "../../../../store/postValidityDataStore";

export default function ValiditySummary() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const { visible, alertData, showAlert, hideAlert } = useAlert();

  const url = process.env.EXPO_PUBLIC_API_URL;

  const validity = postValidityDataStore((state) => state.validity);
  const removeProduct = postValidityDataStore((state) => state.removeProduct);
  const resetProducts = postValidityDataStore((state) => state.resetProductsList);

  const [isLoading, setIsLoading] = useState(false);

  const postValidity = async () => {


    if (validity.products.length === 0) {
      showAlert({
        title: "Erro!",
        text: "Nenhum produto para ser adicionado!",
        icon: "error-outline",
        color: Colors.red,
        onClose: () => {
          router.back();
        },
        iconFamily: MaterialIcons,
      });
      return;
    }

    setIsLoading(true);
    console.log(validity);

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${url}/validities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          validity
        ),
      });

      const responseData = await response.json();

      if (responseData.createdValidity) {
        showAlert({
          title: "Sucesso!",
          text: responseData.message,
          icon: "check-circle-outline",
          color: "#13BE19",
          onClose: () => {
            resetProducts();
            router.back();
          },
          iconFamily: MaterialIcons,
        });
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.message,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons,
        });
      }
    } catch (error) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.cardsBox}>
        <View style={styles.filialTitleBox}>
          <Text style={[styles.filialTitleText, { color: theme.title }]}>Filial: {validity.branch_id}</Text>
        </View>

        <FlatList
          data={validity.products}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <View style={[styles.card, { backgroundColor: theme.uiBackground }]}>
              <Text style={[styles.cardTitleText, { color: theme.title }]}>
                #{index + 1} - {item.description}
              </Text>
              <View style={styles.productDataBox}>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  <Text style={[styles.label, { color: theme.title }]}>Código:</Text> {item.product_cod}
                </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  <Text style={[styles.label, { color: theme.title }]}>Código Auxiliar:</Text> {item.auxiliary_code}
                </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  <Text style={[styles.label, { color: theme.title }]}>Quantidade:</Text> {item.quantity}
                </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  <Text style={[styles.label, { color: theme.title }]}>Validade:</Text>{" "}
                  {new Date(item.validity_date).toLocaleDateString("pt-BR")}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: theme.cancel }]}
                onPress={() => removeProduct(index)}
              >
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={styles.insertButton}>
          <LargeButton text="Salvar dados" onPress={postValidity} backgroundColor={Colors.green} loading={isLoading} />
        </View>
      </View>

      {alertData && (
        <ModalAlert
          visible={visible}
          buttonPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
          iconColor={alertData.color}
        />
      )}
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
    fontFamily: "Roboto-Bold",
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
    fontFamily: "Roboto-Bold",
    marginBottom: 6,
    color: Colors.blue,
  },
  productDataBox: {
    marginBottom: 8,
  },
  label: {
    fontFamily: "Roboto-Regular",
    color: Colors.blue,
  },
  productDataText: {
    fontFamily: "Roboto-Regular",
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
    fontFamily: "Roboto-Bold",
  },
  insertButton: {
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
  },
});
