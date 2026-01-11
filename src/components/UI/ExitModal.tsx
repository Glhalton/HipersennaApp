import { Colors } from "@/constants/colors";
import { Octicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ModalProps, Text, View } from "react-native";
import Button from "./Button";

type Props = ModalProps & {
  ButtonComponentLeft: () => void;
  ButtonComponentRight: () => void;
  messageButtonLeft?: string;
  messageButtonRight?: string;
  title?: string;
  message?: string;
};

export default function ExitModal({
  ButtonComponentLeft,
  messageButtonLeft = "Cancelar",
  ButtonComponentRight,
  messageButtonRight = "Sair",
  title = "Deseja sair?",
  message = "Se sair agora, poderá perder dados que não foram salvos.",
  ...rest
}: Props) {
  return (
    <Modal animationType="fade" transparent={true} {...rest}>
      <View className="flex-1 items-center justify-center px-12 bg-[rgba(0,0,0,0.53)]">
        <View className="w-full px-4 py-5 bg-white-500 rounded-xl">
          <Octicons className=" text-center" name="alert" size={110} color={Colors.red2} />
          <View className=" items-center pb-5">
            <Text className="font-bold text-2xl">{title}</Text>
            <Text className="text-center">{message}</Text>
          </View>
          <View className="flex-row w-full gap-4">
            <View className="flex-1">
              <Button text={messageButtonLeft} onPress={ButtonComponentLeft} type={2} />
            </View>
            <View className="flex-1">
              <Button text={messageButtonRight} onPress={ButtonComponentRight} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
