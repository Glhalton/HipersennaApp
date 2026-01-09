import { Text, View } from "react-native";

type Props = {
  value: string | string[] | number;
  label: string;
};

export function RowItem({ value, label, }: Props) {
  return (
    <View className="flex-row">
      <Text>{label}</Text>
      <Text className="font-bold">{value}</Text>
    </View>
  );
}
