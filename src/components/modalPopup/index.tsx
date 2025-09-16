import { Octicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ModalProps, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";
import { SmallButton } from "../smallButton";
import { styles } from "./styles";

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
                        color={Colors.red2}
                    />
                    <Text style={styles.titleText}>
                        Deseja sair?
                    </Text>
                    <Text style={styles.text}>
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