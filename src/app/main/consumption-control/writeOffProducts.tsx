import NoData from "@/components/noData";
import { PermissionWrapper } from "@/components/permissionWrapper";
import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import { DropDownInput } from "@/components/UI/DropDownInput";
import { Input } from "@/components/UI/Input";
import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { createConsumptionNotesServices } from "@/services/consumptionNotes.services";
import { getConsumptionProductService } from "@/services/consumptionProducts";
import { branchesStore } from "@/store/branchesStore";
import { consumptionGroupsStore } from "@/store/consumptionGroupsStore";
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
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
  const [isLoading, setIsLoading] = useState(false);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const [consumptionProducts, setconsumptionProducts] = useState<consumptionProduct[]>();
  const [noData, setNoData] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [productCode, setProductCode] = useState("");

  const consumptionGroups = consumptionGroupsStore((state) => state.consumptionGroups);

  const dropdownItems = [
    { label: "Selecione uma opção", value: "" },
    ...consumptionGroups.map((item) => ({
      label: item.description,
      value: String(item.id),
    })),
  ];

  const [consumptionGroupId, setconsumptionGroupId] = useState("");

  const branches = branchesStore((state) => state.branches);
  const [branchId, setBranchId] = useState("");
  const branchItems = branches.map((item) => ({
    label: item.description,
    value: String(item.id),
  }));
  const toggleCheckbox = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const getConsumptionProducts = async () => {
    try {
      setIsLoading(true);

      const data = await getConsumptionProductService({ productCode, branchId, consumptionGroupId });

      if (data.length > 0) {
        setconsumptionProducts(data);
        setNoData(false);
      } else {
        setNoData(true);
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: error.message || "Erro inesperado",
        icon: "error-outline",
        color: "red",
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createConsumptionNotes = async () => {
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
    try {
      setButtonIsLoading(true);

      await createConsumptionNotesServices({ id: Array.from(selectedIds) });

      showAlert({
        title: "Sucesso!",
        text: "Nota de consumo criada com sucesso!",
        icon: "check-circle-outline",
        color: "#13BE19",
        onClose: () => {
          setSelectedIds(new Set());
          getConsumptionProducts();
        },
        iconFamily: MaterialIcons,
      });
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: error.message || "Erro inesperado",
        icon: "error-outline",
        color: "red",
        iconFamily: MaterialIcons,
      });
    } finally {
      setButtonIsLoading(false);
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      getConsumptionProducts();
      return;
    }

    const delay = setTimeout(() => {
      getConsumptionProducts();
    }, 500);

    return () => clearTimeout(delay);
  }, [productCode]);

  return (
    <Screen>
      <View className="pb-3">
        <Input
          iconRightName="sliders"
          IconRightFamily={FontAwesome6}
          onIconRightPress={() => setFilterModal(true)}
          value={productCode}
          onChangeText={setProductCode}
          keyboardType={"number-pad"}
          placeholder={"Cód. produto"}
        />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={60} color={"black"} />
        </View>
      ) : noData ? (
        <NoData />
      ) : (
        <View className="flex-1">
          <FlatList
            data={consumptionProducts}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              const isChecked = selectedIds.has(item.id);
              return (
                <View className="border-b border-gray-300 py-2">
                  <View className="flex-row items-center">
                    <View style={styles.productDataBox}>
                      <RowItem label={`${item.product_code} - `} value={item.description} />
                      <View className="flex-row">
                        <RowItem label="Filial: " value={item.branch_id} />
                        <Text> | </Text>
                        <RowItem label={"Grupo: "} value={item.hsconsumption_groups.description} />
                      </View>
                      <RowItem label={"Quant: "} value={item.quantity} />
                      <RowItem label={"Criado em: "} value={new Date(item.created_at).toLocaleDateString("pt-BR")} />
                    </View>
                    <PermissionWrapper requiredPermissions={[35]}>
                      <TouchableOpacity
                        style={[styles.checkBox]}
                        activeOpacity={0.6}
                        onPress={() => {
                          toggleCheckbox(item.id);
                        }}
                      >
                        <MaterialCommunityIcons
                          name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
                          size={35}
                        />
                      </TouchableOpacity>
                    </PermissionWrapper>
                  </View>
                </View>
              );
            }}
          />
          {Array.from(selectedIds).length > 0 && (
            <View style={styles.button}>
              <Button
                text="Gerar nota"
                onPress={() => {
                  createConsumptionNotes();
                }}
                loading={buttonIsLoading}
              />
            </View>
          )}
        </View>
      )}

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

      <Modal
        visible={filterModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setFilterModal(false);
        }}
      >
        <View className="flex-1 items-center justify-center px-12 bg-[rgba(0,0,0,0.53)]">
          <View className="w-full px-4 py-5 bg-white-500 rounded-xl gap-8 ">
            <View className="gap-3">
              <DropDownInput
                label={"Filial:"}
                value={branchId}
                items={branchItems}
                onChange={(val) => setBranchId(val)}
              />

              <DropDownInput
                label={"Grupo de consumo:"}
                value={consumptionGroupId ?? ""}
                items={dropdownItems}
                onChange={(val: any) => setconsumptionGroupId(val)}
              />
            </View>
            <Button
              text="Confirmar"
              onPress={() => {
                getConsumptionProducts();
                setFilterModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </Screen>
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
