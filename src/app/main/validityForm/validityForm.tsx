import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { postValidityDataStore } from "../../../../store/postValidityDataStore";
import { DateInput } from "../../../components/dateInput";
import { Input } from "../../../components/input";
import { LargeButton } from "../../../components/largeButton";
import ModalAlert from "../../../components/modalAlert";
import ModalPopup from "../../../components/modalPopup";

export default function ValidityForm() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const productsList = postValidityDataStore((state) => state.productsList);
  const addProduct = postValidityDataStore((state) => state.addProduct);

  //codProductInput é o codigo digitado, o productCod é o que é pego após pesquisar o produto
  const [codProductInput, setCodProductInput] = useState("");
  const [productCod, setProductCod] = useState("");
  const [description, setDescription] = useState("");

  const [validityDate, setValidityDate] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");

  const productSearch = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `http://10.101.2.7:3333/products/${codProductInput}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseData = await response.json();

      if (responseData[0]) {
        setDescription(responseData[0].descricao);
      } else {
        console.log(`Erro na consulta: ${responseData.message}`);
      }
    } catch (erro) {
      setModalVisible(true);
      setErrorTitle("Erro!");
      setErrorText("Não foi possível buscar o produto: " + erro);
    } finally {
      setLoading(false);
    }
  };

  function handlerAdicionar() {
    if (!codProductInput || !validityDate || !quantity) {
      setModalVisible(true);
      setErrorTitle("Atenção!");
      setErrorText("Preencha todos os campos obrigatórios!");
      return;
    }
    if (!description) {
      setModalVisible(true);
      setErrorTitle("Erro!");
      setErrorText("Produto não encontrado!");
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

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["bottom"]}
    >
      <View style={styles.formBox}>
        <View style={styles.productInfoBox}>
          <View style={styles.productCodeBox}>
            <View style={{ width: "65%" }}>
              <Input
                IconRight={FontAwesome}
                iconRightName="search"
                label="Código do produto:"
                placeholder="Produto"
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
                  setProductCod(codProductInput);
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
              {loading ? (
                <ActivityIndicator color={theme.iconColor} />
              ) : (
                description || "Produto não encontrado"
              )}
            </Text>
          </ScrollView>
        </View>

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
                handlerAdicionar();
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

      <ModalPopup
        visible={showExitModal}
        onRequestClose={handleCancelExit}
        buttonLeft={handleCancelExit}
        buttonRight={handleConfirmExit}
      />

      <ModalAlert
        visible={modalVisible}
        buttonPress={() => {
          setModalVisible(false);
        }}
        title={errorTitle}
        text={errorText}
        iconCenterName="error-outline"
        IconCenter={MaterialIcons}
      />
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
    paddingTop: 20,
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
    fontFamily: "Lexend-Bold",
    fontSize: 18,
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
    marginTop: 40,
  },
  summaryButton: {
    marginBottom: 20,
  },
});
