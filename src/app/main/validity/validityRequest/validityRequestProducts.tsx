import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import ExitModal from "@/components/UI/ExitModal";
import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { validityDataStore } from "@/store/validityDataStore";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

export default function ValidityRequestProducts() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const { alertData, hideAlert, showAlert, visible } = useAlert();
  const url = process.env.EXPO_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);

  const productsList = validityDataStore((state) => state.validity.products) || [];
  const resetProducts = validityDataStore((state) => state.resetProductsList);

  const updateQuantity = validityDataStore((state) => state.setProductQuantity);
  const updateStatus = validityDataStore((state) => state.setProductStatus);

  const validityData = validityDataStore((state) => state.validity);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [quantity, setQuantity] = useState("");

  const navigation = useNavigation();

  const [forceExit, setForceExit] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);

  const hasEmpty = productsList.some((p) => p.quantity === undefined || p.quantity === null);

  const ProductPress = (item: any) => {
    setSelectedProduct(item);
    setQuantity(item.quantity);
    setModalVisible(true);
  };

  //Botão de voltar o modal
  const backButtonComponentModal = (quant: string) => {
    const quantNumber = Number(quant);
    updateQuantity(selectedProduct.id, quantNumber);

    if (quantNumber > 0) {
      updateStatus(selectedProduct.id, "VISTORIADO");
    } else {
      updateStatus(selectedProduct.id, "NAO_ENCONTRADO");
      updateQuantity(selectedProduct.id, 0);
    }

    setModalVisible(false);
    setQuantity("");
  };

  const notFoundButtonComponentModal = (id: number) => {
    updateStatus(id, "NAO_ENCONTRADO");
    setModalVisible(false);
    updateQuantity(id, 0);
    setQuantity("");
  };

  function getColor(status: string | undefined) {
    if (status === "NAO_VISTORIADO") return "#ff9100ff";
    if (status === "VISTORIADO") return "#5FE664";
    if (status === "NAO_ENCONTRADO") return Colors.red2;
    return;
  }

  function getColorText(status: string | undefined) {
    if (status === "NAO_ENCONTRADO") return "white";
    if (status === "VISTORIADO") return Colors.blue;
    return theme.text;
  }

  //Função para capturar o botão de voltar
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (forceExit) return; // não intercepta se for saída forçada

      e.preventDefault();
      setExitAction(e.data.action);
      setShowExitModal(true);
    });

    return unsubscribe;
  }, [navigation, forceExit]);

  // Quando quiser substituir a tela sem abrir modal:
  const goHome = () => {
    setForceExit(true);
    router.replace("../validityHome");
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (exitAction) {
      navigation.dispatch(exitAction); // executa a navegação original
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    setExitAction(null);
  };

  function statusName(status: string | undefined) {
    if (status === "NAO_ENCONTRADO") return "NÃO ENCONTRADO";
    if (status === "NAO_VISTORIADO") return "NÃO VISTORIADO";
    if (status === "VISTORIADO") return "VISTORIADO";
  }

  const updateStatusRequest = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const productsPayload = validityData.products.map((p) => ({
        id: Number(p.id),
        status: p.status,
      }));

      const response = await fetch(`${url}/validity-requests/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: Number(validityData.request_id),
          status: "CONCLUIDO",
          products: productsPayload,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        showAlert({
          title: "Erro!",
          text: `Erro ao mudar status da solicitação: ${responseData.message}`,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons,
        });
      }
    } catch (erro) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${erro}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    }
  };

  const postValidity = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/validities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validityData),
      });

      const responseData = await response.json();

      if (response.ok) {
        updateStatusRequest();
        showAlert({
          title: "Sucesso!",
          text: responseData.message,
          icon: "check-circle-outline",
          color: "#13BE19",
          iconFamily: MaterialIcons,
          onClose: () => {
            setForceExit(true);
            resetProducts();
            router.replace("../validityHome");
          },
        });
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.error,
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
      <Text className="pb-3 font-bold text-2xl">Selecione o produto e digite a quantidade:</Text>

      <View className="flex-1">
        <FlatList
          data={productsList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                ProductPress(item);
              }}
              className="border-b border-gray-300 py-2"
            >
              <RowItem label={`${item.product_code} - `} value={item.description} />
              <RowItem label="Cod. auxiliar: " value={item.auxiliary_code} />
              <RowItem label="Dt. vencimento: " value={new Date(item.validity_date).toLocaleDateString("pt-BR")} />
              {item.quantity !== undefined && item.quantity !== null && (
                <RowItem label="Quantidade: " value={item.quantity} />
              )}
              <View style={styles.statusBox}>
                <Text>Status: </Text>
                <View className="size-4 rounded-full" style={[{ backgroundColor: getColor(item.status) }]}></View>
                <Text className="font-bold" style={[{ color: getColor(item.status) }]}>
                  {statusName(item.status)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {!hasEmpty && (
          <View style={styles.insertButtonComponent}>
            <Button text="Finalizar validade" onPress={postValidity} loading={isLoading} />
          </View>
        )}
      </View>

      <ExitModal
        visible={showExitModal}
        onRequestClose={handleCancelExit}
        ButtonComponentLeft={handleCancelExit}
        ButtonComponentRight={handleConfirmExit}
      />

      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainerCenter}>
          <View style={[styles.modalBox]}>
            <View style={styles.productDataBox}>
              <Text
                style={[styles.productDataText, { color: theme.text, fontSize: 16, fontFamily: "Roboto-SemiBold" }]}
              >
                {selectedProduct?.description}
              </Text>
              <View style={styles.rowBox}>
                <View style={styles.flexEndBox}>
                  <Text style={[styles.labelModal, { color: theme.title }]}>Cod. produto: </Text>
                </View>
                <View style={styles.flexStartBox}>
                  <Text style={[styles.productDataText, { color: theme.text }]}>{selectedProduct?.product_code}</Text>
                </View>
              </View>
              <View style={styles.rowBox}>
                <View style={styles.flexEndBox}>
                  <Text style={[styles.labelModal, { color: theme.title }]}>Cod. auxiliar: </Text>
                </View>
                <View style={styles.flexStartBox}>
                  <Text style={[styles.productDataText, { color: theme.text }]}>{selectedProduct?.auxiliary_code}</Text>
                </View>
              </View>
              <View style={styles.rowBox}>
                <View style={styles.flexEndBox}>
                  <Text style={[styles.labelModal, { color: theme.title }]}>Dt. Validade: </Text>
                </View>
                <View style={styles.flexStartBox}>
                  <Text style={[styles.productDataText, { color: theme.text }]}>
                    {new Date(selectedProduct?.validity_date).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              </View>
              <View>
                <View style={styles.rowBox}>
                  <View style={[styles.flexEndBox, { justifyContent: "center" }]}>
                    <Text style={[styles.labelModal, { color: theme.title }]}>Quantidade: </Text>
                  </View>
                  <View style={styles.flexStartBox}>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: theme.inputColor,
                          borderColor: theme.iconColor,
                          color: theme.title,
                        },
                      ]}
                      inputMode="numeric"
                      value={quantity}
                      onChangeText={(text) => setQuantity(text.replace(/[^0-9]/g, ""))}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.modalButtonComponentsBox}>
              <Button
                text={"Não encontrei"}
                onPress={() => {
                  notFoundButtonComponentModal(selectedProduct.id);
                }}
              />
              <Button
                type={2}
                text={"Confirmar"}
                onPress={() => {
                  backButtonComponentModal(quantity);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

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
  },
  header: {
    paddingVertical: 10,
  },
  titleText: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 20,
  },
  main: { flex: 1 },
  rowBox: {
    flexDirection: "row",
  },
  card: {
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    borderColor: Colors.gray,
  },
  productDataText: {
    fontFamily: "Roboto-Regular",
    textAlign: "center",
  },
  label: {
    fontFamily: "Roboto-SemiBold",
  },
  labelModal: {
    fontFamily: "Roboto-SemiBold",
  },

  listId: {},
  modalContainerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "rgba(0, 0, 0, 0.53)",
  },
  modalBox: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 20,
    gap: 20,
  },
  productDataBox: {
    alignItems: "center",
    width: "100%",
    gap: 4,
  },
  inputBox: {
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  input: {
    height: 40,
    minHeight: 10,
    width: 100,
    backgroundColor: Colors.inputColor,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    fontFamily: "Roboto-Regular",
  },
  modalButtonComponentsBox: {
    paddingTop: 30,
    width: "100%",
    gap: 8,
  },
  dotView: {
    borderRadius: 50,
    width: 13,
    height: 13,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flexEndBox: {
    alignItems: "flex-end",
    paddingRight: 5,
    width: "50%",
  },
  flexStartBox: {
    alignItems: "flex-start",
    width: "50%",
    paddingLeft: 5,
  },
  insertButtonComponent: {
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
  },
});
