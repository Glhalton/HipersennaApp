import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  text: string;
  loading?: boolean;
  type?: number;
};

export default function Button({ text, loading, type = 1, ...rest }: Props) {
  const buttonStyle = () => {
    if (type == 1) {
      return " bg-black-700 ";
    } else if (type == 2) {
      return " bg-[#F4F6F8] border-hairline border-gray-400 shadow-lg ";
    }
  };

  const textStyle = () => {
    if (type == 1) {
      return "text-white-500";
    } else if (type == 2) {
      return "text-black-700";
    }
  };

  return (
    <TouchableOpacity
      className={`${buttonStyle()} h-14 rounded-xl items-center justify-center`}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator className="color-white-500" />
      ) : (
        <Text className={`${textStyle()} text-lg font-medium `}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}
