import { Colors } from "@/constants/colors";
import { FontAwesome, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ModalProps, Text, View, useColorScheme } from "react-native";
import Button from "./Button";

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
      <View className="flex-1 items-center justify-center px-12 bg-[rgba(0,0,0,0.53)]">
        <View className="w-full px-4 py-5 bg-white-500 rounded-xl">
          {IconCenter && iconCenterName && (
            <IconCenter name={iconCenterName as any} size={110} color={iconColor} className=" text-center" />
          )}
          <View className=" items-center pb-5">
            <Text className="font-bold text-2xl">{title}</Text>
            {text && <Text className="text-center">{text}</Text>}
          </View>
          <View>
            <Button text="Ok" onPress={ButtonComponentPress} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
