import {
    FontAwesome,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { PermissionWrapper } from "../permissionWrapper";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof MaterialCommunityIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome5>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>
  | React.ComponentType<React.ComponentProps<typeof Ionicons>>;

type Props = {
  iconName: string;
  IconFamily: IconComponent;
  iconColor?: string;
  label: string;
  route?: string;
  requiredPermissions?: number[];
  requiredRole?: number;
  mode?: "ANY" | "ALL";
  onPress?: () => null | Promise<void>;
};

export function ItemList({
  iconName,
  IconFamily,
  iconColor,
  label,
  route,
  requiredPermissions,
  requiredRole,
  mode = "ALL",
  onPress,
}: Props) {
  return (
    <PermissionWrapper requiredPermissions={requiredPermissions} requiredRole={requiredRole} mode={mode}>
      <TouchableOpacity
        className="border-b border-gray-300 py-3"
        onPress={() => {
          if (onPress) onPress();
          if (route) router.push(route as any);
        }}
      >
        <View className="flex-row items-center gap-5">
          <IconFamily name={iconName as any} color={iconColor} size={30} />
          <Text className="font-semibold text-lg">{label}</Text>
        </View>
      </TouchableOpacity>
    </PermissionWrapper>
  );
}
