import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import { DropDownInput } from "@/components/UI/DropDownInput";
import { Input } from "@/components/UI/Input";
import { Screen } from "@/components/UI/Screen";
import { SmallButton } from "@/components/UI/SmallButton";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { useProduct } from "@/hooks/useProduct";
import { branchesStore } from "@/store/branchesStore";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera";

type InputOptions = {
  label: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  onChangeText?: (text: string) => void;
};

export default function SearchProduct() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const [codProductInput, setCodProductInput] = useState("");
  const [optionFilter, setOptionFilter] = useState("codprod");
  const [filterProductModal, setFilterProductModal] = useState(false);
  const [inputOptions, setInputOptions] = useState<InputOptions>({
    label: "Código do produto:",
    placeholder: "Cod. Produto",
    keyboardType: "numeric",
    onChangeText: (codProd) => setCodProductInput(codProd.replace(/[^0-9]/g, "")),
  });

  const [branchId, setBranchId] = useState("");
  const branches = branchesStore((state) => state.branches);
  const dropdownItems = branches.map((item) => ({
    label: item.description,
    value: String(item.id),
  }));

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
  } = useProduct(showAlert);

  const searchProduct = async () => {
    const product = await productSearch(optionFilter, codProductInput, Number(branchId));
    if (product) {
      router.push({ pathname: "./productData", params: product });
    }
  };

  return (
    <Screen>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View className="gap-4">
        <DropDownInput label={"Filial"} value={branchId} items={dropdownItems} onChange={(val) => setBranchId(val)} />
        <View className="flex-row items-end gap-3">
          <View className="flex-1 bg-red">
            <Input
              {...inputOptions}
              value={codProductInput}
              IconRightFamily={FontAwesome6}
              iconRightName="sliders"
              onIconRightPress={() => setFilterProductModal(true)}
            />
          </View>
          <View className="">
            <SmallButton
              IconFamily={Ionicons}
              iconName="camera"
              iconSize={30}
              onPress={() => {
                setOptionFilter("codauxiliar");
                setCodProductInput("");
                setProductData(undefined);
                setInputOptions({
                  label: "Código de barras",
                  placeholder: "Cod. barras",
                  keyboardType: "numeric",
                  onChangeText: (codProd) => setCodProductInput(codProd.replace(/[^0-9]/g, "")),
                });
                openCamera();
              }}
            />
          </View>
        </View>
        <Button
          text={"Pesquisar"}
          onPress={() => {
            searchProduct();
          }}
          loading={isLoading}
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
                    label: "Código de barras",
                    placeholder: "Cod. barras",
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
        <AlertModal
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
    </Screen>
  );
}

const styles = StyleSheet.create({
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
