import { Colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Linking, Modal, StyleSheet, Text, useColorScheme, View } from "react-native";
import Button from "./Button";

type ModalProps = {
  visible: boolean;
};

export default function UpdateModal({ visible }: ModalProps) {
  const openPlayStore = () => {
    Linking.openURL("https://play.google.com/store/apps/details?id=com.hipersenna.GHSApp");
  };
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View className="flex-1 items-center justify-center px-5 bg-[rgba(0,0,0,0.53)]">
        <View className="px-4 py-5 bg-white-500 rounded-xl">
          <MaterialIcons name="update" size={110} className=" text-center" />
          <View className=" items-center pb-5">
            <Text className="font-bold text-2xl">App desatualizado</Text>
            <Text className="text-center">
              A versão do app é menor que a versão publicada na play store, atualize para a nova versão.
            </Text>
          </View>
          <Button text={"Atualizar"} onPress={openPlayStore} />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({});
