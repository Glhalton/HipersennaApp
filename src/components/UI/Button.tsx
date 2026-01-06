import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  text: string;
  loading?: boolean;
};

export default function Button({ text, loading, ...rest }: Props) {
  return (
    <TouchableOpacity className="h-14 bg-black-700 rounded-xl items-center justify-center" disabled={loading} {...rest}>
      {loading ? (
        <ActivityIndicator className="color-white-500" />
      ) : (
        <Text className="text-lg font-medium text-white-500">{text}</Text>
      )}
    </TouchableOpacity>
  );
}
