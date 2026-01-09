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
import { ActivityIndicator, FlatList, StatusBar, Text, TouchableOpacity, useColorScheme, View } from "react-native";

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
  quantity: number;
};

export default function Requests() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const url = process.env.EXPO_PUBLIC_API_URL;

  const [ordinationItems, setOrdinationItems] = useState([
    { label: "Recentes", value: "desc" },
    { label: "Antigos", value: "asc" },
  ]);

  const [ordination, setOrdination] = useState<"asc" | "desc">("desc");

  const [isLoading, setIsLoading] = useState(true);

  const [noData, setNoData] = useState(false);

  const [requests, setRequests] = useState<Request[]>([]);

  const setProductsList = validityDataStore((state) => state.setProductsList);

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
          setRequests(responseData);
        } else {
          setNoData(true);
        }
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.error,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons,
        });
      }
    } catch (error) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor ${error}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getValidityRequests();
  }, []);

  useEffect(() => {
    getValidityRequests();
  }, [ordination]);

  function getColor(status: string | null) {
    if (status === "PENDENTE") return "#E80000";
    if (status === "EM_ANDAMENTO") return "#51ABFF";
    if (status === "CONCLUIDO") return "#13BE19";
    if (status === "EXPIRADO") return "#555353ff";
    return "black";
  }

  if (noData) {
    return <NoData />;
  }

  return (
    <Screen>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View>
        <OrdinationButton items={ordinationItems} value={ordination} onChange={(val: any) => setOrdination(val)} />
      </View>
      <View className="flex-1">
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator color={theme.iconColor} size={60} />
          </View>
        ) : (
          <FlatList
            data={requests}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                className="border-b border-gray-300 py-2 flex-row justify-between items-center"
                activeOpacity={0.6}
                onPress={() => {
                  router.push("./requestProducts");
                  setProductsList(item.hsvalidity_request_products);
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
                <Octicons name="chevron-right" size={30} />
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
          IconCenter={alertData?.iconFamily}
        />
      )}
    </Screen>
  );
}
