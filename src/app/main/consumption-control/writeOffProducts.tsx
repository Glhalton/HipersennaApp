import { ButtonComponent } from "@/components/buttonComponent";
import { DropdownInput } from "@/components/dropdownInput";
import { Input } from "@/components/input";
import ModalAlert from "@/components/modalAlert";
import NoData from "@/components/noData";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type consumptionProduct = {
  id: number;
  description: string;
  consumption_id?: number;
  employee_id: number;
  branch_id: number;
  product_code: number;
  auxiliary_code: string;
  quantity: number;
  group_id: number;
  created_at: string;
  modified_at: string;
  hsconsumption_groups: {
    id: number;
    description: string;
    created_at: string;
    modified_at: string;
  };
};

export default function WriteOffProducts() {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const [consumptionProducts, setconsumptionProducts] = useState<consumptionProduct[]>();
  const [noData, setNoData] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [productCode, setProductCode] = useState("");

  const [branchId, setBranchId] = useState("");

  const [consumptionGroups, setconsumptionGroups] = useState([]);
  const [consumptionGroupId, setconsumptionGroupId] = useState("");

  const branches = [
    { label: "Selecione uma opção", value: "" },
    { label: "1 - Matriz", value: "1" },
    { label: "2 - Faruk", value: "2" },
    { label: "3 - Carajás", value: "3" },
    { label: "4 - VS10", value: "4" },
    { label: "5 - Xinguara", value: "5" },
    { label: "6 - DP6", value: "6" },
    { label: "7 - Cidade Jardim", value: "7" },
  ];

  const toggleCheckbox = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const getconsumptionProducts = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${url}/consumption-products?product_code=${productCode}&branch_id=${branchId}&group_id=${consumptionGroupId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        setconsumptionProducts(responseData);
        setNoData(false);
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
    } catch (error: any) {
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

  const createconsumptionNotes = async () => {
    if (Array.from(selectedIds).length === 0) {
      showAlert({
        title: "Atenção!",
        text: "Nenhum produto selecionado para baixa",
        icon: "alert",
        color: Colors.orange,
        iconFamily: Octicons,
      });
      return;
    }

    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumption-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: Array.from(selectedIds) }),
      });

      const responseData = await response.json();

      if (response.ok) {
        showAlert({
          title: "Sucesso!",
          text: "Nota de consumo criada com sucesso!",
          icon: "check-circle-outline",
          color: "#13BE19",
          onClose: () => {
            setSelectedIds(new Set());
            getconsumptionProducts();
          },
          iconFamily: MaterialIcons,
        });
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
        text: `Não foi possível conectar ao servidor: ${error}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    }
  };

  const getconsumptionGroups = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumption-groups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setconsumptionGroups([
          { label: "Selecione um grupo", value: "" },
          ...responseData.map((g) => ({
            label: g.description,
            value: String(g.id),
          })),
        ]);
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
        text: `Não foi possível conectar ao servidor: ${error}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    } finally {
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      getconsumptionProducts();
      getconsumptionGroups(); // busca imediata
      return;
    }

    const delay = setTimeout(() => {
      getconsumptionProducts();
    }, 500);

    return () => clearTimeout(delay);
  }, [productCode]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <View style={styles.productSearchBox}>
          <View style={styles.productInputBox}>
            <Input
              placeholder="Cod. Produto"
              keyboardType="numeric"
              value={productCode}
              onChangeText={setProductCode}
              IconRight={Ionicons}
              iconRightName="search"
            />
          </View>

          <TouchableOpacity
            style={[styles.filterButtonComponent, { backgroundColor: theme.itemBackground }]}
            onPress={() => {
              setFilterModal(true);
            }}
          >
            <FontAwesome6 name="sliders" color={theme.iconColor} size={25} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={60} color={theme.iconColor} />
        </View>
      ) : noData ? (
        <NoData />
      ) : (
        <View style={styles.main}>
          <FlatList
            data={consumptionProducts}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            style={[styles.flatList, { borderColor: theme.border }]}
            renderItem={({ item, index }) => {
              const isChecked = selectedIds.has(item.id);

              return (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.card}
                  onPress={() => {
                    toggleCheckbox(item.id);
                  }}
                >
                  <View style={styles.dataBox}>
                    <View style={styles.productDataBox}>
                      <View style={[styles.rowBox]}>
                        <Text style={[styles.text, { color: theme.text }]}>
                          {item.product_code} - {item.description}
                        </Text>
                      </View>

                      <View style={styles.rowBox}>
                        <Text style={[styles.label, { color: theme.title }]}>Filial: </Text>
                        <Text style={[styles.text, { color: theme.text }]}>{item.branch_id}</Text>
                        <Text style={[styles.label, { color: theme.title }]}> | </Text>
                        <Text style={[styles.label, { color: theme.title }]}>Grupo: </Text>
                        <Text style={[styles.text, { color: theme.text }]}>
                          {item.hsconsumption_groups.description}
                        </Text>
                      </View>
                      <View style={styles.rowBox}>
                        <Text style={[styles.label, { color: theme.title }]}>Quantidade: </Text>
                        <Text style={[styles.text, { color: theme.text }]}>{item.quantity}</Text>
                      </View>
                      <View style={[styles.rowBox]}>
                        <Text style={[styles.label, { color: theme.title }]}>Criado em: </Text>
                        <Text style={[styles.text, { color: theme.text }]}>
                          {new Date(item.created_at).toLocaleDateString("pt-BR")}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.checkBox]}>
                      <MaterialCommunityIcons
                        name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
                        color={theme.iconColor}
                        size={35}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          {Array.from(selectedIds).length > 0 && (
            <View style={styles.button}>
              <ButtonComponent
                text="Gerar nota"
                onPress={() => {
                  createconsumptionNotes();
                }}
                style={{ backgroundColor: theme.button }}
              />
            </View>
          )}
        </View>
      )}

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

      <Modal
        visible={filterModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setFilterModal(false);
        }}
      >
        <View style={styles.modalContainerCenter}>
          <View style={[styles.modalBox, { backgroundColor: theme.background }]}>
            <View style={styles.filterFormBox}>
              <View>
                <DropdownInput
                  label={"Filial:"}
                  value={branchId}
                  items={branches}
                  onChange={(val) => setBranchId(val)}
                />
              </View>
              <View>
                <DropdownInput
                  label={"Grupo de consumo:"}
                  value={consumptionGroupId ?? ""}
                  items={consumptionGroups}
                  onChange={(val: any) => setconsumptionGroupId(val)}
                />
              </View>
            </View>
            <ButtonComponent
              text="Confirmar"
              onPress={() => {
                getconsumptionProducts();
                setFilterModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 10,
  },
  main: {
    flex: 1,
  },
  flatList: {},
  card: {
    borderBottomWidth: 0.5,
    paddingVertical: 10,
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
  dataBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBox: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  productDataBox: {
    flex: 1,
  },
  checkBox: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 10,
  },
  productSearchBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 15,
  },
  productInputBox: {
    flex: 1,
  },
  filterButtonComponent: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  modalContainerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    backgroundColor: "rgba(0, 0, 0, 0.53)",
  },
  modalBox: {
    gap: 150,
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
  filterFormBox: {
    gap: 10,
  },
});
