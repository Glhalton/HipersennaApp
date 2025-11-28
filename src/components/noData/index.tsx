import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { styles } from "./style";

type IconComponent = React.ComponentType<React.ComponentProps<typeof Ionicons>>;
type NoDataProps = {
  message?: string;
  iconName?: IconComponent;
  iconSize?: number;
  iconColor?: string;
};

export default function NoData({
  message = "Nenhum dado foi encontrado!",
  iconName = "file-tray-outline",
  iconSize = 80,
  iconColor = Colors.gray,
}) {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName as any} size={iconSize} color={iconColor} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
