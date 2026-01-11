import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import { DropDownInput } from "@/components/UI/DropDownInput";
import { Input } from "@/components/UI/Input";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { useProduct } from "@/hooks/useProduct";
import { createConsumptionProduct } from "@/services/consumptionProducts";
import { branchesStore } from "@/store/branchesStore";
import { consumptionGroupsStore } from "@/store/consumptionGroupsStore";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
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

export default function ConsumptionForm() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
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
  const branches = branchesStore((state) => state.branches);
  const branchItems = branches.map((item) => ({
    label: item.description,
    value: String(item.id),
  }));

  const createConsumptionProductsFetch = async () => {
    if (!branchId || !consumptionGroupId || !productCode || !quantity || !productData) {
      showAlert({
        title: "Atenção!",
        text: "Preencha todos os campos obrigatórios!",
        icon: "alert",
        color: "red",
        iconFamily: Octicons,
      });
      return;
    }

    try {
      setIsApiloading(true);

      await createConsumptionProduct({
        branch_id: Number(branchId),
        auxiliary_code: productData.codAuxiliar,
        group_id: consumptionGroupId,
        product_code: Number(productCode),
        quantity: Number(quantity),
      });

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
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: error.message || "Erro inesperado",
        icon: "error-outline",
        color: "red",
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
    setProductData,
  } = useProduct(showAlert);

  return (
    <Screen>
      <View className="gap-4">
        <DropDownInput label={"Filial"} value={branchId} items={branchItems} onChange={(val) => setBranchId(val)} />

        <DropDownInput
          label={"Grupo de consumo"}
          value={consumptionGroupId ?? ""}
          items={dropdownItems}
          onChange={(val: any) => setconsumptionGroupId(val)}
        />

        <View className="flex-row items-end gap-3">
          <View className="flex-1">
            <Input
              label="Código do Produto"
              placeholder="0"
              keyboardType="numeric"
              onChangeText={(codProd) => setProductCode(codProd.replace(/[^0-9]/g, ""))}
              value={productCode}
            />
          </View>

          <TouchableOpacity
            className="h-12 w-14 bg-black-700 justify-center items-center rounded-xl"
            onPress={() => {
              productSearch("codprod", productCode, 1);
            }}
          >
            {isLoading ? <ActivityIndicator color={"white"} /> : <Ionicons name="search" size={25} color={"white"} />}
          </TouchableOpacity>
        </View>

        {productData?.descricao && (
          <View className="bg-white-900 p-4 rounded-xl shadow">
            <Text className="font-bold">{productData?.descricao}</Text>
            <View className="flex-row">
              <Text>Cod.Auxiliar: </Text>
              <Text>{productData?.codAuxiliar}</Text>
            </View>
          </View>
        )}

        <Input
          label="Quantidade"
          placeholder="0"
          keyboardType="numeric"
          value={quantity}
          onChangeText={(quantity) => setQuantity(quantity.replace(/[^0-9]/g, ""))}
        />
        <Button
          loading={isAPiLoading}
          text="Enviar"
          onPress={() => {
            createConsumptionProductsFetch();
            Keyboard.dismiss();
          }}
        />
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
        <AlertModal
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  productNameText: {
    fontSize: 15,
    color: Colors.gray,
    fontFamily: "Roboto-Bold",
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
