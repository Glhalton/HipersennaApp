import ModalAlert from "@/components/modalAlert";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { postValidityDataStore } from "../../../../store/postValidityDataStore";
import { LargeButton } from "../../../components/largeButton";
import ModalPopup from "../../../components/modalPopup";

export default function ValidityRequestProducts() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [modalIcon, setModalIcon] = useState("");
  const [iconColor, setIconColor] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const productsList =
    postValidityDataStore((state) => state.productsList) || [];
  const resetProducts = postValidityDataStore(
    (state) => state.resetProductsList,
  );

  const updateQuantity = postValidityDataStore(
    (state) => state.updateProductQuantity,
  );
  const updateStatus = postValidityDataStore(
    (state) => state.updateProductStatus,
  );

  const validityData = postValidityDataStore((state) => state.validity);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [index, setIndex] = useState<any>("");

  const navigation = useNavigation();

  const [forceExit, setForceExit] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);

  const hasEmpty = productsList.some(
    (p) => p.quantity === undefined || p.quantity === null,
  );

  //Função para abrir o modal
  const ProductPress = (item: any, index: number) => {
    setSelectedProduct(item);
    setQuantity(item.quantity);
    setIndex(index);
    setModalVisible(true);
  };

  //Botão de voltar o modal
  const backButtonModal = (quant: string) => {
    const quantNumber = Number(quant);

    updateQuantity(index, quantNumber);

    if (quantNumber > 0) {
      updateStatus(index, "Vistoriado");
      console.log("Produto Vistoriado: ", productsList[index]);
    } else {
      updateStatus(index, "Nao_encontrado");
      updateQuantity(index, 0);
    }

    setModalVisible(false);
    setQuantity("");
  };

  const notFoundButtonModal = () => {
    updateStatus(index, "Nao_encontrado");
    setModalVisible(false);
    updateQuantity(index, 0);
    setQuantity("");
  };

  function getColor(status: string | undefined) {
    if (status === "Vistoriado") return "#5FE664";
    if (status === "Nao_encontrado") return Colors.red2;
    return theme.uiBackground;
  }

  function getColorText(status: string | undefined) {
    if (status === "Nao_encontrado") return "white";
    if (status === "Vistoriado") return Colors.blue;
    return theme.text;
  }

  useEffect(() => {
    console.log(validityData);
    console.log(productsList);
  }, []);

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
    router.replace("/main/home");
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

  const updateStatusRequest = async () => {

    const token = await AsyncStorage.getItem("token");

    try {
      const productsPayload = productsList.map((p) => ({
        product_cod: Number(p.product_cod),
        status: p.productStatus,
      }));

      console.log("Payload enviado:", {
        requestId: Number(validityData.request_id),
        status: "Concluido",
        products: productsPayload,
      });

      const response = await fetch(
        "http://10.101.2.7:3333/validityRequests/validityRequestsUpdate",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestId: Number(validityData.request_id),
            status: "Concluido",
            products: productsPayload,
          }),
        },
      );

      const responseData = await response.json();

      if (!responseData.validityRequestUpdate) {
        setErrorTitle("Erro ao mudar status da solicitação");
        setErrorText(responseData.message);
        setModalIcon("error-outline");
        setIconColor(Colors.red);
        setModalAlertVisible(true);
      }
    } catch (erro) {
      setErrorTitle("Erro");
      setErrorText(`Não foi possível conectar ao servidor: ${erro}`);
      setModalIcon("error-outline");
      setIconColor(Colors.red);
      setModalAlertVisible(true);
    }
  };

  const postValidity = async () => {
    setIsLoading(true);

    const token = await AsyncStorage.getItem("token");

    if (productsList.length === 0) {
      Alert.alert("Atenção", "Nenhum produto para ser adicionado.");
      return;
    }

    try {
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
        updateStatusRequest();
        setErrorTitle("Sucesso!");
        setErrorText(responseData.message);
        setModalIcon("check-circle-outline");
        setIconColor("#13BE19");
        setModalAlertVisible(true);
      } else {
        setErrorTitle("Erro!");
        setErrorText(responseData.error);
        setModalIcon("error-outline");
        setModalAlertVisible(true);
        setIconColor(Colors.red);
      }
    } catch (erro) {
      setErrorTitle("Erro!");
      setErrorText(`Não foi possível conectar ao servidor: ${erro}`);
      setModalIcon("error-outline");
      setIconColor(Colors.red);
      setModalAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.cardsContainer}>
        <View style={styles.titleBox}>
          <Text style={[styles.titleText, { color: theme.title }]}>
            Digite a quantidade para cada produto:
          </Text>
        </View>

        <FlatList
          data={productsList}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                ProductPress(item, index);
                console.log(item);
              }}
            >
              <View
                style={[
                  styles.card,
                  { backgroundColor: getColor(item.productStatus) },
                ]}
              >
                <View style={styles.listId}>
                  <Text
                    style={[
                      styles.label,
                      { color: getColorText(item.productStatus) },
                    ]}
                  >
                    {index + 1}°
                  </Text>
                </View>
                <View>
                  <View style={styles.codDescricaoProdutoRow}>
                    <Text
                      style={[
                        styles.label,
                        { color: getColorText(item.productStatus) },
                      ]}
                    >
                      {item.product_cod}:{" "}
                      <Text
                        style={[
                          styles.productDataText,
                          { color: getColorText(item.productStatus) },
                        ]}
                      >
                        {item.description}
                      </Text>{" "}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.label,
                        { color: getColorText(item.productStatus) },
                      ]}
                    >
                      Dt. vencimento:{" "}
                      <Text
                        style={[
                          styles.productDataText,
                          { color: getColorText(item.productStatus) },
                        ]}
                      >
                        {new Date(item.validity_date).toLocaleDateString(
                          "pt-BR",
                        )}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.dadosItem}>
                  <View style={styles.codDescricaoProdutoRow}>
                    <Text
                      style={[
                        styles.label,
                        { color: getColorText(item.productStatus) },
                      ]}
                    >
                      {" "}
                      Quant:{" "}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.productDataText,
                        { color: getColorText(item.productStatus) },
                      ]}
                    >
                      {" "}
                      {item.quantity}{" "}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {!hasEmpty && (
          <View>
            <LargeButton
              text="Finalizar validade"
              onPress={postValidity}
              backgroundColor={theme.red}
              loading={isLoading}
            />
          </View>
        )}
      </View>

      <ModalPopup
        visible={showExitModal}
        onRequestClose={handleCancelExit}
        buttonLeft={handleCancelExit}
        buttonRight={handleConfirmExit}
      />

      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainerCenter}>
          <View
            style={[styles.modalBox, { backgroundColor: theme.uiBackground }]}
          >
            <View style={styles.productDataBox}>
              <Text style={[styles.labelModal, { color: theme.title }]}>
                Cod. Produto:{" "}
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  {selectedProduct?.product_cod}
                </Text>
              </Text>
              <Text style={[styles.labelModal, { color: theme.title }]}>
                Descrição:{" "}
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  {selectedProduct?.description}
                </Text>
              </Text>
              <Text style={[styles.labelModal, { color: theme.title }]}>
                Dt. Validade:{" "}
                <Text style={[styles.productDataText, { color: theme.text }]}>
                  {new Date(selectedProduct?.validity_date).toLocaleDateString(
                    "pt-BR",
                  )}
                </Text>
              </Text>
              <View style={styles.inputBox}>
                <Text style={[styles.labelModal, { color: theme.title }]}>
                  Quant:
                </Text>
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
                  onChangeText={setQuantity}
                />
              </View>
            </View>
            <View style={styles.modalButtonsBox}>
              <LargeButton
                text={"Não encontrei"}
                onPress={() => {
                  notFoundButtonModal();
                }}
                backgroundColor={theme.red}
              />
              <LargeButton
                backgroundColor={"#13BE19"}
                text={"Confirmar"}
                onPress={() => backButtonModal(quantity)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <ModalAlert
        visible={modalAlertVisible}
        buttonPress={() => {
          setModalAlertVisible(false);
          resetProducts();
          goHome();
        }}
        title={errorTitle}
        text={errorText}
        iconCenterName={modalIcon}
        IconCenter={MaterialIcons}
        iconColor={iconColor}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleBox: {
    alignItems: "center",
    paddingBottom: 20,
  },
  titleText: {
    fontFamily: "Lexend-Bold",
    color: Colors.blue,
    fontSize: 25,
  },
  cardsContainer: {
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.gray,
    marginBottom: 10,
    padding: 10,
  },
  codDescricaoProdutoRow: {
    flexDirection: "row",
    maxWidth: 200,
  },
  productDataText: {
    fontFamily: "Lexend-Regular",
    color: Colors.gray,
  },
  label: {
    fontFamily: "Lexend-Bold",
    color: Colors.blue,
  },
  labelModal: {
    fontFamily: "Lexend-Bold",
    fontSize: 16,
    color: Colors.blue,
  },
  textHeader: {
    fontFamily: "Lexend-Regular",
    color: "white",
  },
  dadosItem: {
    alignItems: "center",
  },
  listId: {
    padding: 10,
  },
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
    borderRadius: 10,

    paddingLeft: 20,
    fontSize: 18,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    fontFamily: "Lexend-Regular",
  },
  modalButtonsBox: {
    paddingTop: 30,
    width: "100%",
    gap: 8,
  },
});
