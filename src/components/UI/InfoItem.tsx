import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  value: string | string[] | number;
  label: string;
  textToCopy?: string | string[];
};

export function InfoItem({ value, label, textToCopy }: Props) {
  const copyText = async (text: string | string[]) => {
    await Clipboard.setStringAsync(text as any);
  };

  const handleCopy = () => {
    if (!textToCopy) return;

    const finalText = Array.isArray(textToCopy) ? textToCopy.join(" ") : String(textToCopy);

    copyText(finalText);
  };

  return (
    <View className="gap-1">
      <View className="flex-row gap-2">
        <Text>{label}</Text>
        {textToCopy && (
          <TouchableOpacity onPress={handleCopy}>
            <Ionicons name="copy-outline" size={22} />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-lg font-bold ">{value}</Text>
    </View>
  );
}
