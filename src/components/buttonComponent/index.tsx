import { Colors } from "@/constants/colors";
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, useColorScheme, View } from "react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
  text: string;
  loading?: boolean;
  color?: string;
};

export function ButtonComponent({ text, color = "white", style, loading, ...rest }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <View>
      <TouchableOpacity
        style={[styles.ButtonComponent, { backgroundColor: theme.button2 }, style]}
        activeOpacity={0.6}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={[styles.ButtonComponentText, { color }]}>{text}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
