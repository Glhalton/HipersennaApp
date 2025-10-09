import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    ModalProps,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { Colors } from "../../constants/colors";
import { styles } from "./styles";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = ModalProps & {
  IconCenter?: IconComponent;
  iconCenterName?: string;
  title: string;
  text: string;
  iconColor?: string;
  buttonPress: () => void;
};

export default function ModalAlert({
  iconColor = Colors.red,
  IconCenter,
  title,
  iconCenterName,
  text,
  buttonPress,
  ...rest
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <Modal animationType="fade" transparent={true} {...rest}>
      <View style={styles.modalContainerCenter}>
        <View
          style={[styles.modalBox, { backgroundColor: theme.uiBackground }]}
        >
          {IconCenter && iconCenterName && (
            <IconCenter
              name={iconCenterName as any}
              size={130}
              color={iconColor}
            />
          )}

          <View style={styles.textBox}>
            <Text style={[styles.titleText, { color: theme.title }]}>
              {title}
            </Text>
            <Text style={[styles.text, { color: theme.text }]}>{text}</Text>
          </View>

          <View style={styles.buttonBox}>
            <TouchableOpacity onPress={buttonPress} style={styles.button}>
              <Text style={[styles.buttonText, { color: theme.navText }]}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
