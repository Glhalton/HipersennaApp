import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./style";

export default function NoData({
  message = "Nenhum dado foi encontrado!",
  iconName = "file-tray-outline",
  iconSize = 80,
  iconColor = Colors.gray,
}) {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Ionicons name={iconName as any} size={iconSize} color={iconColor} />
      <Text style={styles.text}>{message}</Text>
    </SafeAreaView>
  );
}
