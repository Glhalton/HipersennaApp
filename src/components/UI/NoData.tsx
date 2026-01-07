import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconComponent = React.ComponentType<React.ComponentProps<typeof Ionicons>>;
type NoDataProps = {
  message?: string;
  iconName?: IconComponent;
  iconSize?: number;
  iconColor?: string;
};

export function NoData({
  message = "Nenhum dado foi encontrado!",
  iconName = "file-tray-outline",
  iconSize = 80,
  iconColor = Colors.gray,
}) {
  return (
    <SafeAreaView className="flex-1  px-5 pt-5 justify-center items-center" edges={["bottom"]}>
      <Ionicons name={iconName as any} size={iconSize} />
      <Text className="max-w-64 text-center">{message}</Text>
    </SafeAreaView>
  );
}
