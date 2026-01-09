import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import { DropDownInput } from "@/components/UI/DropDownInput";
import { Input } from "@/components/UI/Input";
import { Screen } from "@/components/UI/Screen";
import { useAlert } from "@/hooks/useAlert";
import { branchesStore } from "@/store/branchesStore";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View } from "react-native";

export default function DispatchForm() {
  const branches = branchesStore((state) => state.branches);

  const dropdownItems = branches.map((item) => ({
    label: item.description,
    value: String(item.id),
  }));
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const [branchId, setBranchId] = useState("");
  const [nfeNumber, setNfeNumber] = useState("");
  const [sealNumber, setSealNumber] = useState("");
  const [bonusNumber, setBonusNumber] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  const url = process.env.EXPO_PUBLIC_API_URL;

  const [isLoading, setIsLoading] = useState(false);

  const createDispatchRecord = async () => {
    if (!branchId || !nfeNumber || !bonusNumber || !sealNumber || !licensePlate) {
      showAlert({
        title: "Atenção!",
        text: "Preencha todos os campos obrigatórios!",
        icon: "alert",
        color: "red",
        iconFamily: Octicons,
      });
      return;
    }

    const token = await AsyncStorage.getItem("token");

    try {
      setIsLoading(true);
      const response = await fetch(`${url}/dispatch-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          branch_id: branchId,
          nfe_number: nfeNumber,
          bonus_number: bonusNumber,
          seal_number: sealNumber,
          license_plate: licensePlate,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        showAlert({
          title: "Sucesso!",
          text: "Registro de expedição cadastrado com sucesso!",
          icon: "check-circle-outline",
          color: "#13BE19",
          onClose() {
            (setBranchId(""), setNfeNumber(""), setBonusNumber(""), setSealNumber(""), setLicensePlate(""));
          },
          iconFamily: MaterialIcons,
        });
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.message,
          icon: "error-outline",
          color: "red",
          iconFamily: MaterialIcons,
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error}`,
        icon: "error-outline",
        color: "red",
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <View className="gap-8">
        <View className="gap-3">
          <DropDownInput label={"Filial"} value={branchId} items={dropdownItems} onChange={(val) => setBranchId(val)} />
          <Input
            label="Nota Fiscal"
            value={nfeNumber}
            placeholder="000000"
            onChangeText={(nfeNumber) => setNfeNumber(nfeNumber.replace(/[^0-9]/g, ""))}
            maxLength={10}
            keyboardType="number-pad"
          />
          <Input
            label="Bônus"
            value={bonusNumber}
            placeholder="000000"
            onChangeText={(bonusNumber) => setBonusNumber(bonusNumber.replace(/[^0-9]/g, ""))}
            maxLength={10}
            keyboardType="number-pad"
          />
          <Input
            label="Lacre"
            value={sealNumber}
            placeholder="000000"
            onChangeText={(sealNumber) => setSealNumber(sealNumber.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
          />
          <Input
            label="Placa do veículo"
            value={licensePlate}
            onChangeText={(licensePlate) => setLicensePlate(licensePlate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
            placeholder="ABC1D23"
            maxLength={7}
          />
        </View>
        <Button
          text="Salvar"
          onPress={() => {
            createDispatchRecord();
          }}
          loading={isLoading}
        />

        {alertData && (
          <AlertModal
            visible={visible}
            onRequestClose={hideAlert}
            ButtonComponentPress={hideAlert}
            title={alertData.title}
            text={alertData.text}
            iconCenterName={alertData.icon}
            IconCenter={alertData.iconFamily}
            iconColor={alertData.color}
          />
        )}
      </View>
    </Screen>
  );
}
