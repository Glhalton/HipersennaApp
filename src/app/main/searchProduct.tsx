import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../components/input";
import { LargeButton } from "../../components/largeButton";
import ModalAlert from "../../components/modalAlert";
import { Colors } from "../../constants/colors";
import { useAlert } from "../../hooks/useAlert";
import { useProduct } from "../../hooks/useProduct";

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

  const [open, setOpen] = useState(false);
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
      <StatusBar barStyle={"light-content"} />
      <ScrollView
        style={[styles.scrollBox, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.filterIcon, { backgroundColor: theme.uiBackground }]}
              onPress={() => {
                setOptionFilter("codauxiliar");
              }}
            >
              <FontAwesome name="camera" color={theme.iconColor} size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterIcon, { backgroundColor: theme.uiBackground }]}
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
            <View style={styles.dropDownBox}>
              <Text style={[styles.label, { color: theme.title }]}>Selecione a Filial:</Text>
              <DropDownPicker
                listMode="SCROLLVIEW"
                placeholder="Selecione uma filial"
                open={open}
                value={branchId}
                items={branches}
                setOpen={setOpen}
                setValue={setBranchId}
                setItems={setBranches}
                style={[styles.dropdownInput, { backgroundColor: theme.inputColor }]}
                dropDownContainerStyle={[styles.optionsBox, { backgroundColor: theme.inputColor }]}
                textStyle={[styles.text, { color: theme.title }]}
                placeholderStyle={[styles.placeholder, { color: theme.text }]}
              />
            </View>

            <View style={styles.searchBox}>
              <Input {...inputOptions} value={codProductInput} />
            </View>

            <View>
              <LargeButton
                text={"Pesquisar"}
                backgroundColor={theme.red}
                onPress={() => {
                  productSearch(optionFilter, codProductInput, Number(branchId));
                }}
                loading={isLoading}
              />
            </View>
          </View>

          <View>
            <View style={[styles.productDataBox, { backgroundColor: theme.uiBackground }]}>
              <Text style={[styles.label, { color: theme.title }]}>
                Descrição: <Text style={[styles.textBold, { color: theme.text }]}>{productData?.descricao}</Text>
              </Text>
              <Text style={[styles.label, { color: theme.title }]}>
                Cód. Auxiliar: <Text style={[styles.textBold, { color: theme.text }]}>{productData?.codAuxiliar}</Text>
              </Text>
              <Text style={[styles.label, { color: theme.title }]}>
                Cód. Produto: <Text style={[styles.textBold, { color: theme.text }]}>{productData?.codProd}</Text>
              </Text>
            </View>

            <View style={styles.pricesBox}>
              <View style={[styles.priceItemBox, { backgroundColor: theme.uiBackground }]}>
                <Text style={[styles.label, { color: theme.title }]}>Preço loja:</Text>
                <Text style={[styles.priceText, { color: Colors.lightBlue }]}>{productData?.precovenda}</Text>
              </View>
              <View style={[styles.priceItemBox, { backgroundColor: theme.uiBackground }]}>
                <Text style={[styles.label, { color: theme.title }]}>Preço futuro:</Text>
                <Text style={[styles.priceText, { color: Colors.lightBlue }]}>{productData?.precotabela}</Text>
              </View>
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
                      backgroundColor: theme.uiBackground,
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
                  style={[styles.optionFilter, { backgroundColor: theme.uiBackground }]}
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
                  style={[styles.optionFilter, { backgroundColor: theme.uiBackground }]}
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

        {alertData && (
          <ModalAlert
            visible={visible}
            buttonPress={hideAlert}
            title={alertData.title}
            text={alertData.text}
            iconCenterName={alertData.icon}
            IconCenter={alertData.iconFamily}
            iconColor={alertData.color}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollBox: {
    backgroundColor: Colors.background,
    width: "100%",
  },
  contentScroll: {
    color: Colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    alignItems: "flex-end",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  filterIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  main: {},
  formBox: {
    gap: 16,
  },
  dropDownBox: {
    width: "100%",
    gap: 6,
  },
  label: {
    fontFamily: "Lexend-Regular",
  },
  dropdownInput: {
    paddingLeft: 15,
    minWidth: 100,
    minHeight: 45,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 20,
    fontFamily: "Lexend-Regular",
  },
  optionsBox: {
    backgroundColor: "#F4F6F8",
    borderColor: "gray",
    paddingLeft: 4,
  },
  text: {
    fontFamily: "Lexend-Regular",
  },
  placeholder: {
    fontFamily: "Lexend-Regular",
    opacity: 0.6,
  },

  searchBox: {},
  productDataBox: {
    borderRadius: 20,
    marginVertical: 20,
    padding: 20,
  },
  textBold: {
    fontFamily: "Lexend-Bold",
  },
  optionFilter: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 15,
    marginVertical: 10,
  },
  productList: {
    maxHeight: 240,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
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
  titleText: {
    fontFamily: "Lexend-Bold",
    fontSize: 24,
    textAlign: "center",
  },
  textModal: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    color: Colors.gray,
  },
  titleBox: {
    width: "100%",
    alignItems: "center",
  },
  optionsBoxModal: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 30,
  },
  pricesBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  priceItemBox: {
    padding: 20,
    borderRadius: 20,
    height: 100,
    width: "45%",
  },
  priceText: {
    fontFamily: "Lexend-Bold",
    fontSize: 25,
    marginTop: 5,
    lineHeight: 25,
  },
  productNameText: {
    fontSize: 15,
    color: Colors.gray,
    fontFamily: "Lexend-Bold",
  },
  productItem: {
    justifyContent: "center",
    borderBottomWidth: 0.4,
    paddingVertical: 10,
  },
  searchText: {
    fontFamily: "Lexend-Regular",
    fontSize: 16,
  },
});
