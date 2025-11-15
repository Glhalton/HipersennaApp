import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../../../components/buttonComponent";
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
        body: JSON.stringify(validity),
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
      <View style={styles.header}>
        <Text style={[styles.filialTitleText, { color: theme.title }]}>Filial: {validity.branch_id}</Text>
      </View>

      <View style={styles.main}>
        <FlatList
          data={validity.products}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ gap: 15, paddingVertical: 20 }}
          renderItem={({ item, index }) => (
            <View style={[styles.card, { backgroundColor: theme.itemBackground }]}>
              <Text style={[styles.cardTitleText, { color: theme.title }]}>
                #{index + 1} - {item.description}
              </Text>
              <View style={styles.productDataBox}>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  <Text style={[styles.label, { color: theme.title }]}>Código Auxiliar:</Text> {item.auxiliary_code}
                </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  <Text style={[styles.label, { color: theme.title }]}>Código:</Text> {item.product_cod} {"   |   "}
                  <Text style={[styles.productDataText, { color: theme.text }]}>
                    <Text style={[styles.label, { color: theme.title }]}>Quantidade:</Text> {item.quantity}
                  </Text>
                </Text>
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  <Text style={[styles.label, { color: theme.title }]}>Validade:</Text>{" "}
                  {new Date(item.validity_date).toLocaleDateString("pt-BR")}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.removeButtonComponent, { backgroundColor: theme.cancel }]}
                onPress={() => removeProduct(index)}
              >
                <Text style={[styles.removeText, { color: theme.buttonText }]}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={styles.insertButtonComponent}>
          <ButtonComponent
            text="Salvar dados"
            onPress={postValidity}
            backgroundColor={Colors.green}
            loading={isLoading}
          />
        </View>
      </View>

      {alertData && (
        <ModalAlert
          visible={visible}
          ButtonComponentPress={hideAlert}
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    paddingBottom: 10,
  },
  filialTitleText: {
    fontFamily: "Roboto-Bold",
    fontSize: 30,
    color: Colors.blue,
  },
  main: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  cardTitleText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  productDataBox: {},
  label: {
    fontFamily: "Roboto-Regular",
  },
  productDataText: {
    fontFamily: "Roboto-SemiBold",
  },
  removeButtonComponent: {
    backgroundColor: "#f72929ff",
    padding: 5,
    borderRadius: 7,
    alignItems: "center",
  },
  removeText: {
    fontFamily: "Roboto-Bold",
  },
  insertButtonComponent: {
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
  },
});
