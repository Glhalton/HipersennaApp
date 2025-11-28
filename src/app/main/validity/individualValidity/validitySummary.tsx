import { ButtonComponent } from "@/components/buttonComponent";
import ModalAlert from "@/components/modalAlert";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { validityDataStore } from "@/store/validityDataStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ValiditySummary() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const { visible, alertData, showAlert, hideAlert } = useAlert();

  const url = process.env.EXPO_PUBLIC_API_URL;

  const validity = validityDataStore((state) => state.validity);
  const removeProduct = validityDataStore((state) => state.removeProduct);
  const resetProducts = validityDataStore((state) => state.resetProductsList);

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

      if (response.ok) {
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
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item, index }) => (
            <View style={[styles.card]}>
              <Text style={[styles.cardTitleText, { color: theme.title }]}>
                #{index + 1} - {item.description}
              </Text>
              <View style={styles.productDataBox}>
                <View>
                  <View style={styles.rowBox}>
                    <Text style={[styles.label, { color: theme.title }]}>Código: </Text>
                    <Text style={[styles.productDataText, { color: theme.text }]}>{item.product_code}</Text>
                  </View>
                  <View style={styles.rowBox}>
                    <Text style={[styles.label, { color: theme.title }]}>Código Auxiliar: </Text>
                    <Text style={[styles.productDataText, { color: theme.text }]}>{item.auxiliary_code}</Text>
                  </View>
                  <View style={styles.rowBox}>
                    <Text style={[styles.label, { color: theme.title }]}>Quantidade: </Text>
                    <Text style={[styles.productDataText, { color: theme.text }]}>{item.quantity}</Text>
                  </View>
                  <View style={styles.rowBox}>
                    <Text style={[styles.label, { color: theme.title }]}>Validade: </Text>
                    <Text style={[styles.productDataText, { color: theme.text }]}>
                      {new Date(item.validity_date).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={[styles.removeButtonComponent, { borderColor: theme.cancel }]}
                    onPress={() => removeProduct(index)}
                  >
                    <Ionicons name="trash-outline" size={30} color={theme.cancel} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />

        <View style={styles.insertButtonComponent}>
          <ButtonComponent
            style={{ backgroundColor: Colors.green }}
            text="Salvar dados"
            onPress={postValidity}
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
  },
  main: {
    flex: 1,
  },
  card: {
    borderBottomWidth: 0.5,
    paddingVertical: 8,
  },
  cardTitleText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  productDataBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontFamily: "Roboto-Regular",
  },
  productDataText: {
    fontFamily: "Roboto-SemiBold",
  },
  removeButtonComponent: {
    padding: 5,
    borderRadius: 12,
    borderWidth: 2,
  },
  insertButtonComponent: {
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
  },
  rowBox: {
    flexDirection: "row",
  },
});
