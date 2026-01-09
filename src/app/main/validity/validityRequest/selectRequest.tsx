import AlertModal from "@/components/UI/AlertModal";
import { NoData } from "@/components/UI/NoData";
import { OrdinationButton } from "@/components/UI/OrdinationButton";
import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { validityDataStore } from "@/store/validityDataStore";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, useColorScheme, View } from "react-native";
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

  const setValidity = validityDataStore((state) => state.addValidity);

  const [noData, setNoData] = useState(false);

  const [validityRequests, setValidityRequests] = useState<Request[]>([]);

  const [ordinationItems, setOrdinationItems] = useState([
    { label: "Recentes", value: "desc" },
    { label: "Antigos", value: "asc" },
  ]);
  const [ordination, setOrdination] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  const getValidityRequests = async () => {
    const token = await AsyncStorage.getItem("token");

    setIsLoading(true);

    try {
      const response = await fetch(`${url}/validity-requests/me?orderBy=${ordination}`, {
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

  useEffect(() => {
    getValidityRequests();
  }, []);

  useEffect(() => {
    getValidityRequests();
  }, [ordination]);

  if (noData) {
    return <NoData />;
  }

  return (
    <Screen>
      <View className="gap-3">
        <Text className="font-bold text-2xl">Selecione uma solicitação:</Text>
        <OrdinationButton items={ordinationItems} value={ordination} onChange={(val: any) => setOrdination(val)} />
      </View>
      <View className="flex-1">
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color={theme.iconColor} size={60} />
          </View>
        ) : (
          <FlatList
            data={validityRequests}
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
        )}
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
