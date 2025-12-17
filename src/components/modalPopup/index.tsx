import { Colors } from "@/constants/colors";
import { Octicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ModalProps, Text, View, useColorScheme } from "react-native";
import { ButtonComponent } from "../buttonComponent";
import { styles } from "./styles";

type Props = ModalProps & {
  ButtonComponentLeft: () => void;
  ButtonComponentRight: () => void;
  messageButtonLeft?: string;
  messageButtonRight?: string;
  title?: string;
  message?: string;
};

export default function ModalPopup({
  ButtonComponentLeft,
  messageButtonLeft = "Cancelar",
  ButtonComponentRight,
  messageButtonRight = "Sair",
  title = "Deseja sair?",
  message = "Se sair agora, poderá perder dados que não foram salvos.",
  ...rest
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <Modal animationType="fade" transparent={true} {...rest}>
      <View style={styles.modalContainerCenter}>
        <View style={[styles.modalBox, { backgroundColor: theme.itemBackground }]}>
          <Octicons name="alert" size={110} color={Colors.red2} />
          <View style={styles.textBox}>
            <Text style={[styles.titleText, { color: theme.title }]}>{title}</Text>
            <Text style={[styles.text, { color: theme.text }]}>{message}</Text>
          </View>
          <View style={styles.modalButtonComponentsBox}>
            <View style={styles.ButtonComponent}>
              <ButtonComponent
                text={messageButtonLeft}
                onPress={ButtonComponentLeft}
                style={[styles.button, { backgroundColor: theme.button }]}
              />
            </View>
            <View style={styles.ButtonComponent}>
              <ButtonComponent
                text={messageButtonRight}
                onPress={ButtonComponentRight}
                style={[styles.button, { backgroundColor: theme.cancel }]}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
