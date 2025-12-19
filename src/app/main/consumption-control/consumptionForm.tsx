import { ButtonComponent } from "@/components/buttonComponent";
import { DropdownInput } from "@/components/dropdownInput";
import { Input } from "@/components/input";
import ModalAlert from "@/components/modalAlert";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { useProduct } from "@/hooks/useProduct";
import { consumptionGroupsStore } from "@/store/consumptionGroupsStore";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConsumptionForm() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const { alertData, hideAlert, showAlert, visible } = useAlert();
  const [isAPiLoading, setIsApiloading] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [productCode, setProductCode] = useState("");

  const consumptionGroups = consumptionGroupsStore((state) => state.consumptionGroups);

  const dropdownItems = consumptionGroups.map((item) => ({
    label: item.description,
    value: String(item.id),
  }));

  const [consumptionGroupId, setconsumptionGroupId] = useState();

  const [branchId, setBranchId] = useState("");

  const branches = [
    { label: "1 - Matriz", value: "1" },
    { label: "2 - Faruk", value: "2" },
    { label: "3 - Carajás", value: "3" },
    { label: "4 - VS10", value: "4" },
    { label: "5 - Xinguara", value: "5" },
    { label: "6 - DP6", value: "6" },
    { label: "7 - Cidade Jardim", value: "7" },
    { label: "8 - Canaã dos Carajás", value: "8" },
  ];

  const createconsumptionProducts = async () => {
    if (!branchId || !consumptionGroupId || !productCode || !quantity || !productData) {
      showAlert({
        title: "Atenção!",
        text: "Preencha todos os campos obrigatórios!",
        icon: "alert",
        color: Colors.orange,
        iconFamily: Octicons,
      });
      return;
    }

    const token = await AsyncStorage.getItem("token");
    setIsApiloading(true);

    try {
      const response = await fetch(`${url}/consumption-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          branch_id: branchId,
          group_id: consumptionGroupId,
          product_code: productCode,
          auxiliary_code: productData.codAuxiliar,
          quantity,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        showAlert({
          title: "Sucesso!",
          text: "Produto de consumo cadastrado com sucesso!",
          icon: "check-circle-outline",
          color: "#13BE19",
          onClose: () => {
            setProductCode("");
            setQuantity("");
            setProductData(null);
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
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsApiloading(false);
    }
  };

  const {
    productsListModal,
    setProductsListModal,
    productSearch,
    isLoading,
    listProductFilter,
    productData,
    setListProductsFilter,
    setProductData,
  } = useProduct(url!, showAlert);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <View style={styles.header}></View>
      <View style={styles.main}>
        <View style={styles.formBox}>
          <View>
            <DropdownInput label={"Filial"} value={branchId} items={branches} onChange={(val) => setBranchId(val)} />
          </View>
          <View>
            <DropdownInput
              label={"Grupo de consumo"}
              value={consumptionGroupId ?? ""}
              items={dropdownItems}
              onChange={(val: any) => setconsumptionGroupId(val)}
            />
          </View>
          <View style={styles.productSearchBox}>
            <View style={styles.productInputBox}>
              <Input
                label="Código do Produto"
                placeholder="Ex: 2012"
                keyboardType="numeric"
                onChangeText={(codProd) => setProductCode(codProd.replace(/[^0-9]/g, ""))}
                value={productCode}
              />
            </View>

            <TouchableOpacity
              style={[styles.searchButtonComponent, { backgroundColor: theme.button }]}
              onPress={() => {
                productSearch("codprod", productCode, 1);
              }}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Ionicons name="search" size={25} color={Colors.white} />
              )}
            </TouchableOpacity>
          </View>

          {productData?.descricao && (
            <View style={[styles.productDataBox, { backgroundColor: theme.itemBackground }]}>
              <Text style={[styles.productNameText, { color: theme.text }]}>{productData?.descricao}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 14 }}>Cod.Auxiliar: </Text>
                <Text style={[{ color: theme.text, fontSize: 14 }]}>{productData?.codAuxiliar}</Text>
              </View>
            </View>
          )}

          <View>
            <Input
              label="Quantidade"
              placeholder="Ex: 10"
              keyboardType="numeric"
              value={quantity}
              onChangeText={(quantity) => setQuantity(quantity.replace(/[^0-9]/g, ""))}
            />
          </View>

          <View style={styles.ButtonComponentsBox}>
            <ButtonComponent
              loading={isAPiLoading}
              style={{ backgroundColor: theme.button }}
              text="Enviar"
              onPress={() => {
                createconsumptionProducts();
                Keyboard.dismiss();
              }}
            />
          </View>
        </View>
      </View>

      <Modal
        visible={productsListModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setProductsListModal(false);
        }}
      >
        <View style={styles.modalContainerCenter}>
          <View style={[styles.modalBox, { backgroundColor: theme.background }]}>
            <FlatList
              data={listProductFilter}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{}}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.productItem, { borderColor: theme.iconColor }]}
                  onPress={() => {
                    setProductData(item);
                    setProductsListModal(false);
                  }}
                >
                  <Text style={[styles.productNameText, { color: theme.title }]}>
                    {item.codProd} - {item.descricao}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.productDataTextModal, { color: theme.title }]}>Cod.Auxiliar: </Text>
                    <Text style={[styles.productDataTextModal, { color: theme.title }]}>{item.codAuxiliar}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {alertData && (
        <ModalAlert
          visible={visible}
          onRequestClose={hideAlert}
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
    paddingVertical: 10,
  },
  header: {},
  main: { flex: 1 },
  formBox: {
    gap: 20,
  },
  productSearchBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 15,
  },
  productInputBox: {
    flex: 1,
  },
  searchButtonComponent: {
    width: "15%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  productDataBox: {
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  productNameText: {
    fontSize: 15,
    color: Colors.gray,
    fontFamily: "Roboto-Bold",
  },
  ButtonComponentsBox: {
    marginVertical: 10,
  },
  modalContainerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    backgroundColor: "rgba(0, 0, 0, 0.53)",
  },
  modalBox: {
    maxHeight: 600,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  productItem: {
    justifyContent: "center",
    borderBottomWidth: 0.4,
    paddingVertical: 10,
  },
  productDataTextModal: {},
});
