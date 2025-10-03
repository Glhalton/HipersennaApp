import ModalAlert from "@/components/modalAlert";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { validityRequestDataStore } from "../../../../store/validityRequestDataStore";
import { useAlert } from "../../../hooks/useAlert";

type Request = {
  id: number;
  branch_id: number;
  status: string;
  created_at: string;
  target_date: string;
  analyst_id: number;
  hsvalidity_request_products: Product[];
};

type Product = {
  product_cod: number;
  description: string;
  validity_date: Date;
  quantity: string;
  status: string;
};

export default function Requests() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const url = process.env.EXPO_PUBLIC_API_URL;

  const [filterItems, setFilterItems] = useState([
    { label: "Novos", value: "1" },
    { label: "Antigos", value: "2" },
  ]);
  const [open, setOpen] = React.useState(false);

  const [ordination, setOrdination] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [requests, setRequests] = useState<Request[]>([]);
  const setProductsList = validityRequestDataStore(
    (state) => state.setProductsList,
  );

  const getValidityRequests = async () => {
    const token = await AsyncStorage.getItem("token")

    try {
      const response = await fetch(
        `${url}/validityRequests/employee`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        },
      );

      const responseData = await response.json();

      if (responseData.validityRequestsByEmployee) {
        setRequests(responseData.validityRequestsByEmployee);
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.error,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons
        })
      }
    } catch (error) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor ${error}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons
      })
    } finally {
      setIsLoading(false);
    }
  };

  const [sortedRequests, setSortedRequests] = useState<Request[]>([]);

  const sortRequests = (option: string | null) => {
    let sorted: Request[] = [...requests];

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
  }, [requests]);

  function getColor(status: string | null) {
    if (status === "Pendente") return "#FF6200";
    if (status === "Em andamento") return "#51ABFF";
    if (status === "Concluido") return "#13BE19";
    if (status === "Expirado") return "#E80000";
    return "black";
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={theme.iconColor} size={60} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.contentBox}>
        <View style={styles.header}>
          <View style={styles.filterBox}>
            <View style={styles.filterBox}>
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
                style={[
                  styles.dropdownInput,
                  { backgroundColor: theme.inputColor },
                ]}
                dropDownContainerStyle={[
                  styles.optionsBox,
                  { backgroundColor: theme.inputColor },
                ]}
                textStyle={[styles.optionsText, { color: theme.title }]}
                placeholderStyle={[styles.placeholder, { color: theme.text }]}
              />
            </View>
          </View>
        </View>
        <View style={styles.flatListBox}>
          <FlatList
            data={sortedRequests}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  router.push("./requestProducts");
                  setProductsList(item.hsvalidity_request_products);
                }}
              >
                <View
                  style={[styles.card, { backgroundColor: theme.uiBackground }]}
                >
                  <Text style={[styles.cardTitle, { color: theme.title }]}>
                    # {item.id}
                  </Text>
                  <View style={styles.requestDataBox}>
                    <View>
                      <Text style={[styles.text, { color: theme.text }]}>
                        <Text style={[styles.label, { color: theme.title }]}>
                          Filial:
                        </Text>{" "}
                        {item.branch_id}
                      </Text>
                      {/* <Text style={styles.label}>HortiFruti | Frios</Text> */}
                      <View style={styles.dates}>
                        <Text style={[styles.text, { color: theme.text }]}>
                          <Text style={[styles.label, { color: theme.title }]}>
                            Dt. Criação:
                          </Text>{" "}
                          {new Date(item.created_at).toLocaleDateString(
                            "pt-BR",
                          )}
                        </Text>
                        {/* <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Dt. Limite:</Text> {new Date(item.target_date).toLocaleDateString("pt-BR")}</Text> */}
                      </View>
                      <View style={styles.statusBox}>
                        <Text style={[styles.label, { color: theme.title }]}>
                          Status:
                        </Text>
                        <View
                          style={[
                            styles.dotView,
                            { backgroundColor: getColor(item.status) },
                          ]}
                        ></View>
                        <Text
                          style={[
                            styles.statusText,
                            { color: getColor(item.status) },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.iconBox}>
                      <Octicons
                        name="chevron-right"
                        size={40}
                        color={theme.iconColor}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {alertData && (
        <ModalAlert
          visible={visible}
          buttonPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData?.iconFamily}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentBox: {
    paddingHorizontal: 14,
    flex: 1,
  },
  header: {
    paddingVertical: 15,
  },
  filterBox: {},
  flatListBox: {
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 15,
    borderColor: Colors.gray,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Lexend-Bold",
    color: Colors.blue,
  },
  label: {
    fontFamily: "Lexend-Regular",
    color: Colors.blue,
  },
  text: {
    color: Colors.gray,
    fontFamily: "Lexend-Regular",
  },
  requestDataBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dates: {},
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusText: {
    fontFamily: "Lexend-Regular",
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
    minHeight: 30,
    width: 140,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 20,
  },
  optionsBox: {
    minHeight: 40,
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
    fontFamily: "Lexend-Regular",
  },
  placeholder: {
    fontFamily: "Lexend-Regular",
  },
});
