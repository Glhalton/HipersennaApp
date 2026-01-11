import NoData from "@/components/noData";
import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import { DropDownInput } from "@/components/UI/DropDownInput";
import { InfoItem } from "@/components/UI/InfoItem";
import { Input } from "@/components/UI/Input";
import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { useAlert } from "@/hooks/useAlert";
import { getDispatch } from "@/services/dispatchRecords.services";
import { branchesStore } from "@/store/branchesStore";
import { FontAwesome6, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type DispatchRecord = {
  id: number;
  branch_id: number;
  nfe_number: string;
  seal_number: string;
  bonus_number: string;
  license_plate: string;
  created_by_employee_id: number;
  created_at: string;
  modified_at: string;
  employee: {
    name: string;
  };
};

export default function DispatchSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const { alertData, hideAlert, showAlert, visible } = useAlert();
  const [noData, setNoData] = useState(false);

  const [dispatchRecords, setDispatchRecords] = useState<DispatchRecord[]>();
  const [dispatchRecordSelected, setDispatchRecordSelected] = useState<DispatchRecord>();
  const [dispatchRecordModal, setDispatchRecordModal] = useState(false);
  const [filter, setFilter] = useState("nfe_number");
  const [filterValue, setFilterValue] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const filterItems = [
    { label: "Nota fiscal", value: "nfe_number" },
    { label: "Bônus", value: "bonus_number" },
    { label: "Lacre", value: "seal_number" },
    { label: "Veículo", value: "license_plate" },
    { label: "Funcionário", value: "employee_id" },
  ];

  const [branchId, setBranchId] = useState("");

  const branches = branchesStore((state) => state.branches);
  const dropdownItems = [
    { label: "Selecione uma opção", value: "" },
    ...branches.map((item) => ({
      label: item.description,
      value: String(item.id),
    })),
  ];

  const getDispatchRecords = async () => {
    try {
      setIsLoading(true);

      const data = await getDispatch({ branchId, filter, filterValue });

      if (data.length > 0) {
        setDispatchRecords(data);
        setNoData(false);
      } else {
        setDispatchRecords([]);
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      getDispatchRecords();
      return;
    }

    const delay = setTimeout(() => {
      getDispatchRecords();
    }, 500);

    return () => clearTimeout(delay);
  }, [filterValue]);

  return (
    <Screen>
      <View className="pb-3">
        <Input
          iconRightName="sliders"
          IconRightFamily={FontAwesome6}
          onIconRightPress={() => setFilterModal(true)}
          value={filterValue}
          onChangeText={setFilterValue}
          keyboardType={filter == "license_plate" ? "default" : "number-pad"}
          placeholder={filterItems.find((item) => item.value === filter)?.label}
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
            data={dispatchRecords}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                className="border-b border-gray-300 py-2"
                onPress={() => {
                  setDispatchRecordSelected(item);
                  setDispatchRecordModal(true);
                }}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <View className="flex-row">
                      <Text className="font-bold text-lg">Filial </Text>
                      <Text className="font-bold text-lg">{item.branch_id}</Text>
                    </View>
                    <RowItem label="• NFe: " value={item.nfe_number} />
                    <RowItem label="• Criado em: " value={new Date(item.created_at).toLocaleDateString("pt-BR")} />
                  </View>
                  <View>
                    <Octicons name="chevron-right" size={30} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
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
          <View className="w-full px-4 py-5 bg-white-500 rounded-xl">
            <View className="gap-3">
              <DropDownInput
                label={"Filial:"}
                value={branchId}
                items={dropdownItems}
                onChange={(val) => setBranchId(val)}
              />
              <DropDownInput
                label={"Buscar por:"}
                value={filter}
                items={filterItems}
                onChange={(val) => setFilter(val)}
              />
              <Button
                text="Confirmar"
                onPress={() => {
                  getDispatchRecords();
                  setFilterModal(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={dispatchRecordModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setDispatchRecordModal(false);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setDispatchRecordModal(false)}>
          <View className="flex-1 items-center justify-center px-12 bg-[rgba(0,0,0,0.53)]">
            <TouchableWithoutFeedback>
              <View className="w-full px-4 py-5 bg-white-500 rounded-xl gap-3 ">
                <InfoItem label="Criado por:" value={dispatchRecordSelected?.employee?.name ?? "-"} />
                <View className="flex-row ">
                  <View className="w-1/2 gap-3">
                    <InfoItem label="Filial:" value={dispatchRecordSelected?.branch_id ?? "-"} />
                    <InfoItem label="Nota Fiscal:" value={dispatchRecordSelected?.nfe_number ?? "-"} />
                    <InfoItem label="Veículo:" value={dispatchRecordSelected?.license_plate ?? "-"} />
                    <InfoItem
                      label="Criado em: "
                      value={new Date(dispatchRecordSelected?.created_at).toLocaleDateString("pt-BR")}
                    />
                  </View>
                  <View className="w-1/2 gap-3">
                    <InfoItem label="Funcionário: " value={dispatchRecordSelected?.created_by_employee_id ?? "-"} />
                    <InfoItem label="Bônus:" value={dispatchRecordSelected?.bonus_number ?? "-"} />
                    <InfoItem label="Lacre:" value={dispatchRecordSelected?.seal_number ?? "-"} />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
