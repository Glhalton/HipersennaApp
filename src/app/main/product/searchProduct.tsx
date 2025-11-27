import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera";
import { ButtonComponent } from "../../../components/buttonComponent";
import { DropdownInput } from "../../../components/dropdownInput";
import { Input } from "../../../components/input";
import ModalAlert from "../../../components/modalAlert";
import { Colors } from "../../../constants/colors";
import { useAlert } from "../../../hooks/useAlert";
import { useProduct } from "../../../hooks/useProduct";

type InputOptions = {
  label: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  onChangeText?: (text: string) => void;
  IconRight?: any;
  iconRightName?: string;
};

export default function SearchProduct() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const [codProductInput, setCodProductInput] = useState("");
  const [optionFilter, setOptionFilter] = useState("codprod");
  const [filterProductModal, setFilterProductModal] = useState(false);
  const [inputOptions, setInputOptions] = useState<InputOptions>({
    IconRight: FontAwesome,
    iconRightName: "search",
    label: "Código do produto:",
    placeholder: "Cod. Produto",
    keyboardType: "numeric",
    onChangeText: (codProd) => setCodProductInput(codProd.replace(/[^0-9]/g, "")),
  });

  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([
    { label: "1 - Matriz", value: "1" },
    { label: "2 - Faruk", value: "2" },
    { label: "3 - Carajás", value: "3" },
    { label: "4 - VS10", value: "4" },
    { label: "5 - Xinguara", value: "5" },
    { label: "6 - DP6", value: "6" },
    { label: "7 - Cidade Jardim", value: "7" },
  ]);

  const [cameraModal, setCameraModal] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [scanned, setScanned] = useState(false);

  const device = useCameraDevice("back");

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
      searchProduct();
      setScanned(false); // libera para próxima leitura
    }
  }, [cameraModal, scanned, codProductInput]);

  const openCamera = async () => {
    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) {
        showAlert({
          title: "Acesso negado!",
          text: "O acesso à câmera do dispositivo foi negado. Por favor, habilite o acesso nas configurações do dispositivo.",
          icon: "close-circle-outline",
          color: theme.cancel,
          iconFamily: Ionicons,
        });
        return;
      }
    }

    if (!device) {
      showAlert({
        title: "Erro!",
        text: "Nenhuma câmera encontrada no dispositivo.",
        icon: "close-circle-outline",
        color: theme.cancel,
        iconFamily: Ionicons,
      });
      return;
    }
    setCameraModal(true);
  };

  const {
    productsListModal,
    setProductsListModal,
    productSearch,
    isLoading,
    listProductFilter,
    setListProductsFilter,
    setProductData,
  } = useProduct(url!, showAlert);

  const searchProduct = async () => {
    const product = await productSearch(optionFilter, codProductInput, Number(branchId));
    if (product) {
      router.push({ pathname: "./productData", params: product });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
      {/* <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} /> */}
       <StatusBar barStyle={"dark-content"} />
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
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
            <FontAwesome6 name="sliders" color={theme.iconColor} size={25} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.formBox}>
          <View>
            <DropdownInput label={"Filial:"} value={branchId} items={branches} onChange={(val) => setBranchId(val)} />
          </View>

          <View style={styles.searchBox}>
            <Input {...inputOptions} value={codProductInput} />
          </View>

          <View>
            <ButtonComponent
              style={{ backgroundColor: theme.button }}
              text={"Pesquisar"}
              onPress={() => {
                searchProduct();
              }}
              loading={isLoading}
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
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.productItem, { borderColor: theme.iconColor }]}
                  onPress={() => {
                    setProductsListModal(false);
                    const product = item;
                    if (product) {
                      router.push({ pathname: "./productData", params: product });
                    }
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
                    IconRight: FontAwesome,
                    iconRightName: "search",
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
                    IconRight: FontAwesome,
                    iconRightName: "search",
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
                    IconRight: FontAwesome,
                    iconRightName: "search",
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

      {alertData && (
        <ModalAlert
          onRequestClose={hideAlert}
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
    paddingVertical: 10,
  },

  header: {
    alignItems: "flex-end",
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
    gap: 16,
  },
  searchBox: {},
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
  modalContainerCenter: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
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
  titleText: {
    fontFamily: "Roboto-Bold",
    fontSize: 24,
    textAlign: "center",
  },
  textModal: {
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    color: Colors.gray,
  },
  titleBox: {
    width: "100%",
    alignItems: "center",
  },
  optionsBoxModal: {
    width: "100%",
    paddingVertical: 30,
  },
  productNameText: {
    fontSize: 15,
    color: Colors.gray,
    fontFamily: "Roboto-Bold",
  },
  productItem: {
    justifyContent: "center",
    borderBottomWidth: 0.4,
    paddingVertical: 10,
  },
  camera: {
    flex: 1,
  },
  productDataTextModal: {},
});
