import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { validityDataStore } from "@/store/validityDataStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

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
    <Screen>
      <Text className="text-2xl font-bold">Filial: {validity.branch_id}</Text>
      <View className="flex-1">
        <FlatList
          data={validity.products}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className="border-b border-gray-300 py-3">
              <View style={styles.productDataBox}>
                <View>
                  <RowItem label={`${index + 1} - `} value={item.description} />
                  <RowItem label="Código: " value={item.product_code} />
                  <RowItem label="Código auxiliar: " value={item.auxiliary_code} />
                  <RowItem label="Quantidade: " value={item.quantity} />
                  <RowItem label="Validade: " value={new Date(item.validity_date).toLocaleDateString("pt-BR")} />
                </View>
                <TouchableOpacity
                  style={[styles.removeButtonComponent, { borderColor: theme.cancel }]}
                  onPress={() => removeProduct(index)}
                >
                  <Ionicons name="trash-outline" size={30} color={theme.cancel} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <View className="my-3">
          <Button text="Salvar dados" onPress={postValidity} loading={isLoading} />
        </View>
      </View>

      {alertData && (
        <AlertModal
          visible={visible}
          ButtonComponentPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
          iconColor={alertData.color}
        />
      )}
    </Screen>
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
