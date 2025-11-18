import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ButtonComponent } from "../../../../components/buttonComponent";
import ModalAlert from "../../../../components/modalAlert";
import ModalPopup from "../../../../components/modalPopup";
import { Colors } from "../../../../constants/colors";
import { useAlert } from "../../../../hooks/useAlert";
import { postValidityDataStore } from "../../../../store/postValidityDataStore";

export default function ValidityRequestProducts() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const { alertData, hideAlert, showAlert, visible } = useAlert();
  const url = process.env.EXPO_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const productsList = postValidityDataStore((state) => state.validity.products) || [];
  const resetProducts = postValidityDataStore((state) => state.resetProductsList);

  const updateQuantity = postValidityDataStore((state) => state.updateProductQuantity);
  const updateStatus = postValidityDataStore((state) => state.updateProductStatus);

  const validityData = postValidityDataStore((state) => state.validity);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [index, setIndex] = useState<any>("");

  const navigation = useNavigation();

  const [forceExit, setForceExit] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);

  const hasEmpty = productsList.some((p) => p.quantity === undefined || p.quantity === null);

  const ProductPress = (item: any, index: number) => {
    setSelectedProduct(item);
    setQuantity(item.quantity);
    setIndex(index);
    setModalVisible(true);
  };

  //Botão de voltar o modal
  const backButtonComponentModal = (quant: string) => {
    const quantNumber = Number(quant);

    updateQuantity(index, quantNumber);

    if (quantNumber > 0) {
      updateStatus(index, "Vistoriado");
    } else {
      updateStatus(index, "Nao_encontrado");
      updateQuantity(index, 0);
    }

    setModalVisible(false);
    setQuantity("");
  };

  const notFoundButtonComponentModal = () => {
    updateStatus(index, "Nao_encontrado");
    setModalVisible(false);
    updateQuantity(index, 0);
    setQuantity("");
  };

  function getColor(status: string | undefined) {
    if (status === "Nao_vistoriado") return "#ff9100ff";
    if (status === "Vistoriado") return "#5FE664";
    if (status === "Nao_encontrado") return Colors.red2;
    return;
  }

  function getColorText(status: string | undefined) {
    if (status === "Nao_encontrado") return "white";
    if (status === "Vistoriado") return Colors.blue;
    return theme.text;
  }

  //Função para capturar o botão de voltar
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
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
    router.replace("../home");
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
    if (status === "Nao_encontrado") return "Não encontrado";
    if (status === "Nao_vistoriado") return "Não vistoriado";
    if (status === "Vistoriado") return "Vistoriado";
  }

  const updateStatusRequest = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const productsPayload = productsList.map((p) => ({
        product_cod: Number(p.product_cod),
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
          status: "Concluido",
          products: productsPayload,
        }),
      });

      const responseData = await response.json();

      if (!responseData.validityRequestUpdate) {
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

      if (responseData.createdValidity) {
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
            router.replace("../home");
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={[styles.titleText, { color: theme.title }]}>Digite a quantidade para cada produto:</Text>
      </View>
      <View style={styles.main}>
        <FlatList
          data={productsList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                ProductPress(item, index);
              }}
            >
              <View style={[styles.card]}>
                <View style={styles.listId}>
                  <Text style={[styles.label]}># {index + 1}</Text>
                </View>
                <View style={styles.rowBox}>
                  <Text style={[styles.label]}>{item.product_cod}: </Text>
                  <Text style={[styles.productDataText]}>{item.description}</Text>
                </View>
                <View style={styles.rowBox}>
                  <Text style={[styles.label]}>Cod. auxiliar: </Text>
                  <Text style={[styles.productDataText]}>{item.auxiliary_code}</Text>
                </View>
                <View style={styles.rowBox}>
                  <Text style={[styles.label]}>Dt. vencimento: </Text>
                  <Text style={[styles.productDataText]}>
                    {new Date(item.validity_date).toLocaleDateString("pt-BR")}
                  </Text>
                </View>

                <View style={styles.rowBox}>
                  <Text style={[styles.label]}>Quantidade: </Text>
                  <Text style={[styles.productDataText]}> {item.quantity} </Text>
                </View>
                <View style={styles.statusBox}>
                  <Text style={[styles.label]}>Status: </Text>
                  <View style={[styles.dotView, { backgroundColor: getColor(item.status) }]}></View>
                  <Text
                    style={[styles.productDataText, { color: getColor(item.status), fontFamily: "Roboto-SemiBold" }]}
                  >
                    {" "}
                    {statusName(item.status)}{" "}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {!hasEmpty && (
          <View style={styles.insertButtonComponent}>
            <ButtonComponent
              style={{ backgroundColor: Colors.green }}
              text="Finalizar validade"
              onPress={postValidity}
              loading={isLoading}
            />
          </View>
        )}
      </View>

      <ModalPopup
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
              <Text style={[styles.productDataText, { color: theme.text, fontSize: 16 }]}>
                {selectedProduct?.description}
              </Text>
              <View style={styles.rowBox}>
                <View style={styles.flexEndBox}>
                  <Text style={[styles.labelModal, { color: theme.title }]}>Cod. produto: </Text>
                </View>
                <View style={styles.flexStartBox}>
                  <Text style={[styles.productDataText, { color: theme.text }]}>{selectedProduct?.product_cod}</Text>
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
                    <Text style={[styles.labelModal, { color: theme.title }]}>Quantidade:</Text>
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
              <ButtonComponent
                text={"Não encontrei"}
                style={{ backgroundColor: theme.cancel, borderRadius: 12 }}
                onPress={() => {
                  notFoundButtonComponentModal();
                }}
              />
              <ButtonComponent
                style={{ backgroundColor: theme.button, borderRadius: 12 }}
                text={"Confirmar"}
                onPress={() => {
                  (backButtonComponentModal(quantity));
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

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
