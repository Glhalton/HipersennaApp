import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateInput } from "../../../components/dateInput";
import { Input } from "../../../components/input";
import { LargeButton } from "../../../components/largeButton";
import ModalAlert from "../../../components/modalAlert";
import ModalPopup from "../../../components/modalPopup";
import { Colors } from "../../../constants/colors";
import { useAlert } from "../../../hooks/useAlert";
import { postValidityDataStore } from "../../../store/postValidityDataStore";

type Produto = {
  descricao: string;
  [key: string]: any; // caso tenha outros campos desconhecidos
};


export default function ValidityForm() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const productsList = postValidityDataStore((state) => state.productsList);
  const addProduct = postValidityDataStore((state) => state.addProduct);

  //codProductInput é o codigo digitado, o productCod é o que é pego após pesquisar o produto
  const [codProductInput, setCodProductInput] = useState("");
  const [productCod, setProductCod] = useState("");
  const [description, setDescription] = useState("");

  const [validityDate, setValidityDate] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const [filterProductModal, setFilterProductModal] = useState(false);
  const [optionFilter, setOptionFilter] = useState("codprod");

  const [listProductFilter, setListProductsFilter] = useState<Produto[]>([])

  const productSearch = async () => {
    const token = await AsyncStorage.getItem("token");
    try {

      setIsLoading(true);

      if (optionFilter != "descricao") {
        const response = await fetch(
          `${url}/products/?${optionFilter}=${codProductInput}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const responseData = await response.json();

        if (response.ok) {
          setDescription(responseData[0].descricao);
          setProductCod(responseData[0].codProd);
        } else {
          if (response.status == 401) {
            showAlert({
              title: "Erro!",
              text: `${responseData.message}`,
              icon: "error-outline",
              color: Colors.red,
              iconFamily: MaterialIcons
            })
          }
          setDescription("");
          setProductCod("");
        }
      } else {
        const response = await fetch(
          `${url}/products/?${optionFilter}=${codProductInput}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const responseData = await response.json();

        if (response.ok) {
          setListProductsFilter(responseData);
        } else {
          if (response.status == 401) {
            showAlert({
              title: "Erro!",
              text: `${responseData.message}`,
              icon: "error-outline",
              color: Colors.red,
              iconFamily: MaterialIcons
            })
          }
          setListProductsFilter([]);
          setDescription("");
          setProductCod("");
        }
      }

    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possivel conectar ao servidor: ${error.message}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons
      })
    } finally {
      setIsLoading(false);
    }
  };

  function addProductList() {
    if (!codProductInput || !validityDate || !quantity) {
      showAlert({
        title: "Atenção!",
        text: "Preencha todos os campos obrigatórios!",
        icon: "alert",
        color: Colors.orange,
        iconFamily: Octicons
      })
      return;
    }
    if (!description) {
      showAlert({
        title: "Atenção!",
        text: "Produto não encontrado",
        icon: "alert",
        color: Colors.orange,
        iconFamily: Octicons
      })
      return;
    }

    addProduct({
      product_cod: Number(productCod),
      description,
      validity_date: validityDate,
      quantity: Number(quantity),
    });

    setCodProductInput("");
    setQuantity("");
    setDescription("");
    setListProductsFilter([]);
    setValidityDate(undefined);
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <StatusBar barStyle={"light-content"} />
      <View style={styles.formBox}>
        <View style={styles.header}>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={[styles.filterIcon, { backgroundColor: theme.uiBackground }]} onPress={() => { setOptionFilter("codauxiliar") }}>
              <FontAwesome
                name="camera"
                color={theme.iconColor}
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterIcon, { backgroundColor: theme.uiBackground }]} onPress={() => { setFilterProductModal(true) }}>
              <FontAwesome
                name="filter"
                color={theme.iconColor}
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>

        {optionFilter == "codprod" && (
          <View>
            <View style={styles.productInfoBox}>
              <View style={styles.productCodeBox}>
                <View style={{ width: "65%" }}>
                  <Input
                    IconRight={FontAwesome}
                    iconRightName="search"
                    label="Código do produto:"
                    placeholder="Cod. Produto"
                    keyboardType="numeric"
                    value={codProductInput}
                    onChangeText={(codProd) =>
                      setCodProductInput(codProd.replace(/[^0-9]/g, ""))
                    }
                  />
                </View>
                <View style={styles.searchBox}>
                  <TouchableOpacity
                    style={[styles.searchButton, { backgroundColor: theme.red }]}
                    onPress={() => {
                      productSearch();
                    }}
                  >
                    <Text style={[styles.searchText, { color: theme.navText }]}>
                      Buscar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.productNameBox,
                { backgroundColor: theme.uiBackground },
              ]}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={[styles.productNameText, { color: theme.title }]}>
                  {isLoading ? (
                    <ActivityIndicator color={theme.iconColor} />
                  ) : (
                    description || "Produto não encontrado"
                  )}
                </Text>
              </ScrollView>
            </View>
          </View>


        )}

        {optionFilter == "codauxiliar" && (
          <View>
            <View style={styles.productInfoBox}>
              <View style={styles.productCodeBox}>
                <View style={{ width: "65%" }}>
                  <Input
                    IconRight={FontAwesome}
                    iconRightName="search"
                    label="Código de barras:"
                    placeholder="Cod. Barras"
                    keyboardType="numeric"
                    value={codProductInput}
                    onChangeText={(codProd) =>
                      setCodProductInput(codProd.replace(/[^0-9]/g, ""))
                    }
                  />
                </View>
                <View style={styles.searchBox}>
                  <TouchableOpacity
                    style={[styles.searchButton, { backgroundColor: theme.red }]}
                    onPress={() => {
                      productSearch();
                    }}
                  >
                    <Text style={[styles.searchText, { color: theme.navText }]}>
                      Buscar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.productNameBox,
                { backgroundColor: theme.uiBackground },
              ]}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={[styles.productNameText, { color: theme.title }]}>
                  {isLoading ? (
                    <ActivityIndicator color={theme.iconColor} />
                  ) : (
                    description || "Produto não encontrado"
                  )}
                </Text>
              </ScrollView>
            </View>
          </View>
        )}

        {optionFilter == "descricao" && (
          <View>
            <View style={styles.productInfoBox}>
              <View style={styles.productCodeBox}>
                <View style={{ width: "65%" }}>
                  <Input
                    IconRight={FontAwesome}
                    iconRightName="search"
                    label="Descrição do Produto"
                    placeholder="Descrição"
                    value={codProductInput}
                    onChangeText={setCodProductInput}
                  />
                </View>
                <View style={styles.searchBox}>
                  <TouchableOpacity
                    style={[styles.searchButton, { backgroundColor: theme.red }]}
                    onPress={() => {
                      productSearch();
                    }}
                  >
                    <Text style={[styles.searchText, { color: theme.navText }]}>
                      Buscar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            <View style={[styles.productList, { backgroundColor: theme.uiBackground }]}>
              {isLoading ? (
                <ActivityIndicator color={theme.iconColor} />
              ) : (
                <View>
                  {listProductFilter.length > 0 ? (
                    <FlatList
                      data={listProductFilter}
                      keyExtractor={(_, index) => index.toString()}
                      contentContainerStyle={{ paddingBottom: 20 }}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          style={[styles.productItem, { borderColor: theme.iconColor }]}
                          onPress={() => {
                            setCodProductInput(item.descricao);
                            setProductCod(item.codProd);
                            setListProductsFilter([]);
                            setDescription(item.descricao);
                          }}
                        >
                          <Text style={[styles.productNameText, { color: theme.title }]}>
                            {item.descricao}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <Text style={[styles.productNameText, { color: theme.title, textAlign: "center" }]}>
                        {description || "Produto não encontrado"}
                      </Text>
                    </ScrollView>
                  )}
                </View>

              )}
            </View>
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
            onChangeText={(quantity) =>
              setQuantity(quantity.replace(/[^0-9]/g, ""))
            }
          />
        </View>

        <View style={styles.buttonsBox}>
          <View style={styles.summaryButton}>
            <LargeButton
              text="Inserir"
              backgroundColor={Colors.gray}
              onPress={() => {
                addProductList();
                Keyboard.dismiss();
              }}
            />
          </View>

          {productsList.length > 0 && (
            <View style={styles.summaryButton}>
              <LargeButton
                text="Resumo"
                onPress={() => {
                  console.log(productsList);
                  router.push("./validitySummary");
                }}
                backgroundColor={theme.red}
              />
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={filterProductModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => { setFilterProductModal(false) }}
      >
        <View style={styles.modalContainerCenter}>
          <View
            style={[styles.modalBox, { backgroundColor: theme.background }]}
          >
            <View style={styles.titleBox}>
              <Text style={[styles.titleText, { color: theme.title }]}>
                Selecione o tipo de pesquisa:
              </Text>
            </View>
            <View style={styles.optionsBox}>
              <TouchableOpacity
                style={[styles.optionFilter, {
                  backgroundColor: theme.uiBackground
                }]}
                onPress={() => {
                  setFilterProductModal(false);
                  setOptionFilter("codprod");
                  setCodProductInput("");
                  setDescription("");
                  setProductCod("");
                }}
              >
                <Text style={[styles.text, { color: theme.title, }]}>
                  Código do produto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionFilter, { backgroundColor: theme.uiBackground }]}
                onPress={() => {
                  setFilterProductModal(false);
                  setOptionFilter("codauxiliar");
                  setCodProductInput("");
                  setDescription("");
                  setProductCod("");
                }}
              >
                <Text style={[styles.text, { color: theme.title }]}>
                  Código de barras
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionFilter, { backgroundColor: theme.uiBackground }]}
                onPress={() => {
                  setFilterProductModal(false);
                  setOptionFilter("descricao");
                  setListProductsFilter([]);
                  setCodProductInput("");
                  setDescription("");
                  setProductCod("");
                }}
              >
                <Text style={[styles.text, { color: theme.title }]}>
                  Descrição
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>

      <ModalPopup
        visible={showExitModal}
        onRequestClose={handleCancelExit}
        buttonLeft={handleCancelExit}
        buttonRight={handleConfirmExit}
      />


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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formBox: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: "flex-end",
    paddingBottom: 5,
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
  productInfoBox: {},
  productCodeBox: {
    flexDirection: "row",
  },
  searchBox: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flex: 1,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  searchButton: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  searchText: {
    fontFamily: "Lexend-Regular",
    fontSize: 16,
  },
  productNameBox: {
    backgroundColor: "#e4e4e4cc",
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  productNameText: {
    fontSize: 15,
    color: Colors.gray,
    fontFamily: "Lexend-Bold",
  },
  buttonsBox: {
    marginTop: 10,
  },
  summaryButton: {
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
    justifyContent: "center"
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
    fontFamily: "Lexend-Bold",
    fontSize: 24,
    textAlign: "center"
  },
  text: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    color: Colors.gray,
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
  productItem: {
    justifyContent: "center",
    borderBottomWidth: 0.4,
    paddingVertical: 10,

  }
});
