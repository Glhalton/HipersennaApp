import { Octicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ModalProps, Text, View, useColorScheme } from "react-native";
import { Colors } from "../../../constants/colors";
import { SmallButton } from "../smallButton";
import { styles } from "./styles";

type Props = ModalProps & {
    buttonLeft: () => void,
    buttonRight: () => void,
}

export default function ModalPopup({ buttonLeft, buttonRight, ...rest }: Props) {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    return (
        <Modal
            animationType="fade"
            transparent={true}
            {...rest}
        >
            <View style={styles.modalContainerCenter}>
                <View style={[styles.modalBox, {backgroundColor: theme.uiBackground}]}>
                    <Octicons
                        name="alert"
                        size={80}
                        color={Colors.red2}
                    />
                    <Text style={[styles.titleText, {color: theme.title}]}>
                        Deseja sair?
                    </Text>
                    <Text style={[styles.text, {color: theme.text}]}>
                        Se sair agora, poderá perder dados que não foram salvos.
                    </Text>
                    <View style={styles.modalButtonsBox}>
                        <SmallButton
                            backgroundColor={Colors.gray}
                            title={"Cancelar"}
                            onPress={buttonLeft}
                        />
                        <SmallButton
                            title={"Sair"}
                            onPress={buttonRight}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}