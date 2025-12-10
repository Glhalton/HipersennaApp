import ModalAlert from "@/components/modalAlert";
import NoData from "@/components/noData";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { validityDataStore } from "@/store/validityDataStore";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Request = {
  id: number;
  branch_id: number;
  analyst_id: number;
  conferee_id: number;
  status: string;
  created_at: string;
  modified_at: string;
  hsvalidity_request_products: Product[];
};

type Product = {
  id: number;
  request_id: number;
  status: string;
  product_code: number;
  validity_date: Date;
  auxiliary_code: string;
  description: string;
};

export default function SelectRequest() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const insets = useSafeAreaInsets();
  const { visible, showAlert, hideAlert, alertData } = useAlert();

  const setProductsValidity = validityDataStore((state) => state.setProductsList);
  const setValidity = validityDataStore((state) => state.addValidity);

  const [noData, setNoData] = useState(false);

  const [validityRequests, setValidityRequests] = useState<Request[]>([]);

  const [filterItems, setFilterItems] = useState([
    { label: "Novos", value: "1" },
    { label: "Antigos", value: "2" },
  ]);
  const [ordination, setOrdination] = useState("");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getValidityRequests = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/validity-requests/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setValidityRequests(responseData);
      } else if (response.status === 404) {
        setNoData(true);
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.message,
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

  function addValidity(branchId: number, requestId: number, productsList: any[]) {
    setValidity({
      branch_id: branchId,
      request_id: requestId,
      products: productsList,
    });
  }

  function getColor(status: string | null) {
    if (status === "Pendente") return "#E80000";
    if (status === "Em_andamento") return "#51ABFF";
    if (status === "Concluido") return "#13BE19";
    if (status === "Expirado") return "#383838ff";
    return "black";
  }

  //Cria a validade e copia os produtos para uma lista
  const selectedRequest = (item: any) => {
    addValidity(item.branch_id, item.id, item.hsvalidity_request_products);
    router.replace("./validityRequestProducts");
  };

  const [sortedRequests, setSortedRequests] = useState<Request[]>([]);

  const sortRequests = (option: string | null) => {
    let sorted: Request[] = [...validityRequests];

    switch (option) {
      case "1":
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "2":
        sorted.sort((a, b) => a.id - b.id);
        break;
    }

    setSortedRequests(sorted);
  };

  const handleOrdinationChange = (newValue: string) => {
    setOrdination(newValue);
    sortRequests(newValue);
  };

  useEffect(() => {
    getValidityRequests();
  }, []);
  useEffect(() => {
    sortRequests(ordination || "1");
  }, [validityRequests]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator color={theme.iconColor} size={60} />
      </View>
    );
  }

  if (noData) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <NoData />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={[styles.titleText, { color: theme.title }]}>Selecione uma solicitação:</Text>
        <DropDownPicker
          open={open}
          value={ordination}
          items={filterItems}
          setOpen={setOpen}
          setValue={(callback) => {
            const newValue = callback(ordination);
            handleOrdinationChange(newValue);
          }}
          setItems={setFilterItems}
          placeholder="Ordenar por"
          style={[styles.dropdownInput, { backgroundColor: theme.button }]}
          dropDownContainerStyle={[styles.optionsBox, { backgroundColor: theme.button }]}
          textStyle={[styles.optionsText, { color: theme.buttonText }]}
          placeholderStyle={[styles.placeholder, { color: theme.buttonText }]}
          ArrowDownIconComponent={() => <Ionicons name="chevron-down-outline" size={20} color={Colors.white} />}
          ArrowUpIconComponent={() => <Ionicons name="chevron-up-outline" size={20} color={Colors.white} />}
          TickIconComponent={() => <Ionicons name="checkmark" size={20} color={Colors.white} />}
        />
      </View>
      <View style={[styles.main]}>
        <FlatList
          data={sortedRequests}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                selectedRequest(item);
              }}
            >
              <View style={[styles.card]}>
                <View style={styles.requestDataBox}>
                  <View>
                    <Text style={[styles.cardId, { color: theme.title }]}># {item.id}</Text>
                    <Text style={[styles.text, { color: theme.text }]}>
                      <Text style={[styles.label, { color: theme.title }]}>Filial:</Text> {item.branch_id}
                    </Text>
                    <Text style={[styles.text, { color: theme.text }]}>
                      <Text style={[styles.label, { color: theme.title }]}>Dt. Criação:</Text>{" "}
                      {new Date(item.created_at).toLocaleDateString("pt-BR")}
                    </Text>
                    <View style={styles.statusBox}>
                      <Text style={[styles.label, { color: theme.title }]}>Status:</Text>
                      <View style={[styles.dotView, { backgroundColor: getColor(item.status) }]}></View>
                      <Text style={[styles.text, { color: getColor(item.status) }]}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.iconBox}>
                    <Octicons name="chevron-right" size={40} color={theme.iconColor} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
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
    paddingVertical: 15,
  },
  titleText: {
    fontFamily: "Roboto-Bold",
    fontSize: 22,
    paddingBottom: 10,
  },
  main: { flex: 1 },
  card: {
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    borderColor: Colors.gray,
  },
  requestDataBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardId: {
    fontSize: 16,
    fontFamily: "Roboto-SemiBold",
  },
  label: {
    fontFamily: "Roboto-SemiBold",
  },
  text: {
    fontFamily: "Roboto-Regular",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dotView: {
    borderRadius: 50,
    width: 13,
    height: 13,
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownInput: {
    minHeight: 20,
    width: 140,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 20,
  },
  optionsBox: {
    minHeight: 20,
    width: 140,
    borderColor: "gray",
    paddingLeft: 4,
    borderWidth: 0,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  optionsText: {
    fontFamily: "Roboto-Regular",
  },
  placeholder: {
    fontFamily: "Roboto-Regular",
  },
});
