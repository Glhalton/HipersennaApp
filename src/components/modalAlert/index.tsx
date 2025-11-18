import { FontAwesome, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ModalProps, Text, View, useColorScheme } from "react-native";
import { Colors } from "../../constants/colors";
import { ButtonComponent } from "../buttonComponent";
import { styles } from "./styles";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>
  | React.ComponentType<React.ComponentProps<typeof Ionicons>>;

type Props = ModalProps & {
  IconCenter?: IconComponent;
  iconCenterName?: string;
  title: string;
  text: string;
  iconColor?: string;
  ButtonComponentPress: () => void;
};

export default function ModalAlert({
  iconColor = Colors.red,
  IconCenter,
  title,
  iconCenterName,
  text,
  ButtonComponentPress,
  ...rest
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <Modal animationType="fade" transparent={true} {...rest}>
      <View style={styles.modalContainerCenter}>
        <View style={[styles.modalBox, { backgroundColor: theme.itemBackground }]}>
          {IconCenter && iconCenterName && <IconCenter name={iconCenterName as any} size={130} color={iconColor} />}
          <View style={styles.textBox}>
            <Text style={[styles.titleText, { color: theme.title }]}>{title}</Text>
            <Text style={[styles.text, { color: theme.text }]}>{text}</Text>
          </View>
          <View style={styles.ButtonComponentBox}>
            <ButtonComponent
             style={{borderRadius: 12, backgroundColor: theme.cancel}}
              text={"Ok"}
              onPress={ButtonComponentPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
