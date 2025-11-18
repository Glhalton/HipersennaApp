import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera";
import { ButtonComponent } from "../../../../components/buttonComponent";
import { DateInput } from "../../../../components/dateInput";
import { Input } from "../../../../components/input";
import ModalAlert from "../../../../components/modalAlert";
import ModalPopup from "../../../../components/modalPopup";
import { Colors } from "../../../../constants/colors";
import { useAlert } from "../../../../hooks/useAlert";
import { useProduct } from "../../../../hooks/useProduct";
import { postValidityDataStore } from "../../../../store/postValidityDataStore";

type InputOptions = {
  label: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  onChangeText?: (text: string) => void;
  IconRight?: any;
  iconRightName?: string;
};

export default function ValidityForm() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  // const productsList = postValidityDataStore((state) => state.productsList);
  const addProduct = postValidityDataStore((state) => state.addProduct);

  const [codProductInput, setCodProductInput] = useState("");
  const validity = postValidityDataStore((state) => state.validity);
  const [inputOptions, setInputOptions] = useState<InputOptions>({
    label: "Código do produto:",
    placeholder: "Cod. Produto",
    keyboardType: "numeric",
    onChangeText: (codProd) => setCodProductInput(codProd.replace(/[^0-9]/g, "")),
  });

  const [validityDate, setValidityDate] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);
  const navigation = useNavigation();

  const [filterProductModal, setFilterProductModal] = useState(false);
  const [optionFilter, setOptionFilter] = useState("codprod");

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

  const [cameraModal, setCameraModal] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [scanned, setScanned] = useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],

    onCodeScanned: (codes) => {
      if (scanned) return;
      setScanned(true);

      const value = codes[0].value;
      if (value) {
        setCodProductInput(value);
      }

      setCameraModal(false);
    },
  });

  useEffect(() => {
    if (!cameraModal && scanned && codProductInput.length > 0) {
      productSearch(optionFilter, codProductInput, validity.branch_id);
      setScanned(false); // libera para próxima leitura
    }
  }, [cameraModal, scanned, codProductInput]);

  const openCamera = async () => {
    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) {
        console.log("Permissão negada!");
        return;
      }
    }

    if (!device) {
      console.log("Nenhuma câmera encontrada");
      return;
    }
    setCameraModal(true);
  };

  function addProductList() {
    if (!codProductInput || !validityDate || !quantity || Number(quantity) == 0) {
      showAlert({
        title: "Atenção!",
        text: "Preencha todos os campos obrigatórios!",
        icon: "alert",
        color: Colors.orange,
        iconFamily: Octicons,
      });
      return;
    }
    if (!productData?.codAuxiliar) {
      showAlert({
        title: "Atenção!",
        text: "Produto não encontrado",
        icon: "alert",
        color: Colors.orange,
        iconFamily: Octicons,
      });
      return;
    }

    addProduct({
      product_cod: Number(productData?.codProd),
      auxiliary_code: productData?.codAuxiliar,
      description: productData.descricao,
      validity_date: validityDate,
      quantity: Number(quantity),
    });

    setProductData(undefined);
    setCodProductInput("");
    setListProductsFilter([]);
    setValidityDate(undefined);
    setQuantity("");
  }

  //Função para capturar o botão de voltar
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // bloqueia a navegação
      setExitAction(e.data.action); // salva a ação para executar depois
      setShowExitModal(true); // mostra o modal personalizado
    });

    return unsubscribe;
  }, [navigation]);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerButtonComponents}>
          <TouchableOpacity
            style={[styles.filterIcon, { backgroundColor: theme.itemBackground }]}
            onPress={() => {
              setOptionFilter("codauxiliar");
              setCodProductInput("");
              setProductData(undefined);
              setInputOptions({
                IconRight: FontAwesome,
                iconRightName: "search",
                label: "Código de barras:",
                placeholder: "Cod. Barras:",
                keyboardType: "numeric",
                onChangeText: (codProd) => setCodProductInput(codProd.replace(/[^0-9]/g, "")),
              });
              openCamera();
            }}
          >
            <MaterialCommunityIcons name="barcode-scan" color={theme.iconColor} size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterIcon, { backgroundColor: theme.itemBackground }]}
            onPress={() => {
              setFilterProductModal(true);
            }}
          >
            <FontAwesome name="filter" color={theme.iconColor} size={25} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.formBox}>
          <View style={styles.productSearchBox}>
            <View style={styles.productInputBox}>
              <Input {...inputOptions} value={codProductInput} />
            </View>

            <TouchableOpacity
              style={[styles.searchButtonComponent, { backgroundColor: theme.button }]}
              onPress={() => {
                productSearch(optionFilter, codProductInput, validity.branch_id);
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
              <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                <Text style={[styles.productNameText, { color: theme.text }]}>{productData?.descricao}</Text>
              </ScrollView>
              <Text style={[styles.productNameText, { color: theme.text }]}>{productData?.codAuxiliar}</Text>
            </View>
          )}

          <View>
            <DateInput
              label="Data de Validade:"
              placeholder="Data de Vencimento"
              value={validityDate}
              onChange={setValidityDate}
            />
          </View>
          <View>
            <Input
              label="Quantidade:"
              placeholder="Insira a quantidade"
              keyboardType="numeric"
              value={quantity}
              onChangeText={(quantity) => setQuantity(quantity.replace(/[^0-9]/g, ""))}
            />
          </View>

          <View style={styles.ButtonComponentsBox}>
            <View style={styles.summaryButtonComponent}>
              <ButtonComponent
                style={{ backgroundColor: theme.button }}
                text="Inserir"
                onPress={() => {
                  addProductList();
                  Keyboard.dismiss();
                }}
              />
            </View>

            {validity.products.length > 0 && (
              <View style={styles.summaryButtonComponent}>
                <ButtonComponent
                  style={{ backgroundColor: theme.button2 }}
                  text="Resumo"
                  onPress={() => {
                    router.push("./validitySummary");
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      <Modal
        visible={filterProductModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setFilterProductModal(false);
        }}
      >
        <View style={styles.modalContainerCenter}>
          <View style={[styles.modalBox, { backgroundColor: theme.background }]}>
            <View style={styles.titleBox}>
              <Text style={[styles.titleText, { color: theme.title }]}>Selecione o tipo de pesquisa:</Text>
            </View>
            <View style={styles.optionsBoxModal}>
              <TouchableOpacity
                style={[
                  styles.optionFilter,
                  {
                    backgroundColor: theme.itemBackground,
                  },
                ]}
                onPress={() => {
                  setFilterProductModal(false);
                  setOptionFilter("codprod");
                  setCodProductInput("");
                  setProductData(undefined);
                  setInputOptions({
                    label: "Código do produto:",
                    placeholder: "Cod. Produto",
                    keyboardType: "numeric",
                    onChangeText: (codProd) => setCodProductInput(codProd.replace(/[^0-9]/g, "")),
                  });
                }}
              >
                <Text style={[styles.textModal, { color: theme.title }]}>Código do produto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionFilter, { backgroundColor: theme.itemBackground }]}
                onPress={() => {
                  setFilterProductModal(false);
                  setOptionFilter("codauxiliar");
                  setCodProductInput("");
                  setProductData(undefined);
                  setInputOptions({
                    label: "Código de barras:",
                    placeholder: "Cod. Barras:",
                    keyboardType: "numeric",
                    onChangeText: (codProd) => setCodProductInput(codProd.replace(/[^0-9]/g, "")),
                  });
                }}
              >
                <Text style={[styles.textModal, { color: theme.title }]}>Código de barras</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionFilter, { backgroundColor: theme.itemBackground }]}
                onPress={() => {
                  setFilterProductModal(false);
                  setOptionFilter("descricao");
                  setListProductsFilter([]);
                  setCodProductInput("");
                  setProductData(undefined);
                  setInputOptions({
                    label: "Descrição do Produto:",
                    placeholder: "Descrição",
                    onChangeText: setCodProductInput,
                  });
                }}
              >
                <Text style={[styles.textModal, { color: theme.title }]}>Descrição</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={productsListModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setProductsListModal(false);
        }}
      >
        <View style={styles.modalContainerCenter}>
          <View style={[styles.productsModalBox, { backgroundColor: theme.background }]}>
            <FlatList
              data={listProductFilter}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.productItem, { borderColor: theme.iconColor }]}
                  onPress={() => {
                    setProductData(item);
                    setProductsListModal(false);
                  }}
                >
                  <Text style={[styles.productNameText, { color: theme.title }]}>{item.descricao}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <ModalPopup
        visible={showExitModal}
        onRequestClose={handleCancelExit}
        ButtonComponentLeft={handleCancelExit}
        ButtonComponentRight={handleConfirmExit}
      />

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

      <Modal
        visible={cameraModal}
        animationType="fade"
        transparent={false}
        onRequestClose={() => {
          setCameraModal(false);
        }}
      >
        {device ? (
          <Camera style={styles.camera} device={device} isActive={cameraModal} codeScanner={codeScanner} />
        ) : (
          <Text>Carregando câmera...</Text>
        )}
      </Modal>
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
    alignItems: "flex-end",
    paddingBottom: 5,
  },
  headerButtonComponents: {
    flexDirection: "row",
    gap: 10,
  },
  filterIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  main: {},
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
    borderRadius: 8,
  },
  searchText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  productDataBox: {
    alignItems: "center",
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
  textBold: {
    fontFamily: "Roboto-Bold",
  },
  label: {
    fontFamily: "Roboto-Regular",
  },
  productNameText: {
    fontSize: 15,
    color: Colors.gray,
    fontFamily: "Roboto-Bold",
  },
  ButtonComponentsBox: {
    marginVertical: 10,
  },
  summaryButtonComponent: {
    marginBottom: 10,
  },
  modalContainerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    backgroundColor: "rgba(0, 0, 0, 0.53)",
  },
  modalBox: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  productsModalBox: {
    maxHeight: 600,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBox: {
    width: "100%",
    alignItems: "center",
  },
  optionsBox: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 30,
  },
  titleText: {
    fontFamily: "Roboto-Bold",
    fontSize: 24,
    textAlign: "center",
  },
  optionFilter: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  productList: {
    maxHeight: 240,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
  },
  productItem: {
    justifyContent: "center",
    borderBottomWidth: 0.4,
    paddingVertical: 10,
  },
  optionsBoxModal: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 30,
  },
  textModal: {
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    color: Colors.gray,
  },
  camera: {
    flex: 1,
  },
});
