import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, useColorScheme, View } from "react-native";
import { Colors } from "../../constants/colors";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
  text: string;
  color?: string;
  backgroundColor?: string;
  loading?: boolean;
};

export function ButtonComponent({ text, color = "white", backgroundColor = Colors.red2, loading, ...rest }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <View>
      <TouchableOpacity style={[styles.ButtonComponent, { backgroundColor }]} activeOpacity={0.6} {...rest}>
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={[styles.ButtonComponentText, { color }]}>{text}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
