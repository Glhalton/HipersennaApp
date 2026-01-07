import AlertModal from "@/components/UI/AlertModal";
import { NoData } from "@/components/UI/NoData";
import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { validityDataStore } from "@/store/validityDataStore";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        if (responseData.length > 0) {
          setValidityRequests(responseData);
        } else {
          setNoData(true);
        }
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
    if (status === "PENDENTE") return "#E80000";
    if (status === "EM ANDAMENTO") return "#51ABFF";
    if (status === "CONCLUIDO") return "#13BE19";
    if (status === "EXPIRADO") return "#383838ff";
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
    return <NoData />;
  }

  return (
    <Screen>
      <View className="gap-3">
        <Text className="font-bold text-2xl">Selecione uma solicitação:</Text>
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
      <View className="flex-1">
        <FlatList
          data={sortedRequests}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              className="border-b border-gray-300 py-2 flex-row justify-between items-center"
              onPress={() => {
                selectedRequest(item);
              }}
            >
              <View>
                <RowItem label="# " value={item.id} />
                <RowItem label="Filial: " value={item.branch_id} />
                <RowItem label="Dt. criação: " value={new Date(item.created_at).toLocaleDateString("pt-BR")} />
                <View className="flex-row items-center gap-2">
                  <Text>Status:</Text>
                  <View className="size-4 rounded-full" style={[{ backgroundColor: getColor(item.status) }]}></View>
                  <Text className="font-bold" style={[{ color: getColor(item.status) }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View>
                <Octicons name="chevron-right" size={30} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      {alertData && (
        <AlertModal
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
