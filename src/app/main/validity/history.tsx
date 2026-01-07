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
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type validity = {
  id: number;
  branch_id: number;
  employee_id: number;
  status: string | null;
  request_id: number | null;
  created_at: string;
  modified_at: string;
  hsvalidity_products: [];
};

export default function History() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { alertData, hideAlert, showAlert, visible } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const url = process.env.EXPO_PUBLIC_API_URL;

  const [ordinationItems, setOrdinationItems] = useState([
    { label: "Recentes", value: "1" },
    { label: "Antigos", value: "2" },
  ]);

  const [ordination, setOrdination] = useState("");
  const [open, setOpen] = React.useState(false);

  const setProducts = validityDataStore((state) => state.setProductsList);

  const [validities, setValidities] = useState<validity[]>([]);
  const [sortedValidities, setSortedValidities] = useState<validity[]>([]);

  const [noData, setNoData] = useState(false);

  const getValidities = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/validities/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.length > 0) {
          setValidities(responseData);
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
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error.message}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortValidities = (option: string | null) => {
    let sorted = [...validities];

    switch (option) {
      case "1":
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "2":
        sorted.sort((a, b) => a.id - b.id);
        break;
    }

    setSortedValidities(sorted);
  };

  const handleOrdinationChange = (newValue: string) => {
    setOrdination(newValue);
    sortValidities(newValue);
  };

  useEffect(() => {
    getValidities();
  }, []);

  useEffect(() => {
    sortValidities(ordination || "1");
  }, [validities]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={60} color={theme.iconColor} />
      </View>
    );
  }

  if (noData) {
    return <NoData />;
  }

  return (
    <Screen>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View className="">
        <DropDownPicker
          open={open}
          value={ordination}
          items={ordinationItems}
          setOpen={setOpen}
          setValue={(callback) => {
            const newValue = callback(ordination);
            handleOrdinationChange(newValue);
          }}
          setItems={setOrdinationItems}
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
          data={sortedValidities}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              className="border-b border-gray-300 py-2"
              onPress={() => {
                router.push("./historyProducts");
                setProducts(item.hsvalidity_products);
              }}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <RowItem label="#" value={item.id} />
                  <RowItem label="Filial: " value={item.branch_id} />
                  <RowItem label="Criado em: " value={new Date(item.created_at).toLocaleDateString("pt-BR")} />
                </View>
                <View>
                  <Octicons name="chevron-right" size={30} />
                </View>
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
        />
      )}
    </Screen>
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
  main: { flex: 1 },
  flatList: {},
  card: {
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    borderColor: Colors.gray,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  label: {
    fontFamily: "Roboto-Regular",
  },
  text: {
    color: Colors.gray,
    fontFamily: "Roboto-SemiBold",
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
    fontFamily: "Roboto-Regular",
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
    fontFamily: "Roboto-SemiBold",
  },
  placeholder: {
    fontFamily: "Roboto-SemiBold",
  },
});
