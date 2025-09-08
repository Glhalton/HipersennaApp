import React from "react";
import { View, Modal, Text, ModalProps } from "react-native";
import { styles } from "./styles";
import { Octicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { SmallButton } from "../smallButton";

type Props = ModalProps & {
    buttonLeft: () => void,
    buttonRight: () => void,
}

export default function ModalPopup({ buttonLeft, buttonRight, ...rest }: Props) {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            {...rest}
        >
            <View style={styles.modalContainerCenter}>
                <View style={styles.modalBox}>
                    <Octicons
                        name="alert"
                        size={80}
                        color={colors.red2}
                    />
                    <Text style={styles.titleText}>
                        Deseja sair?
                    </Text>
                    <Text style={styles.text}>
                        Se sair agora, poderá perder dados que não foram salvos
                    </Text>
                    <View style={styles.modalButtonsBox}>
                        <SmallButton
                            backgroundColor={colors.gray}
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