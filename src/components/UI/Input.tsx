import { FontAwesome, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>
  | React.ComponentType<React.ComponentProps<typeof Ionicons>>;

type Props = TextInputProps & {
  label?: string;
  className?: string;
  hasBorder?: boolean;
  IconLeftFamily?: IconComponent;
  IconRightFamily?: IconComponent;
  iconLeftName?: string;
  iconRightName?: string;
  onIconLeftPress?: () => void;
  onIconRightPress?: () => void;
};

export function Input({
  className,
  label,
  hasBorder = true,
  IconLeftFamily,
  IconRightFamily,
  iconLeftName,
  iconRightName,
  onIconLeftPress,
  onIconRightPress,
  ...rest
}: Props) {
  return (
    <View className="gap-1">
      {label && <Text className="text-base">{label}</Text>}

      <View
        className={`${hasBorder ? "border-hairline border-gray-400" : "border-0"}
            rounded-xl
            px-4
            h-12
            
            bg-[#F4F6F8]
            flex-row
            shadow-lg
            items-center
            `}
      >
        {IconLeftFamily && iconLeftName && (
          <TouchableOpacity onPress={onIconLeftPress}>
            <IconLeftFamily name={iconLeftName as any} size={20} />
          </TouchableOpacity>
        )}

        <TextInput
          {...rest}
          placeholderTextColor="#6B7280"
          className="
            placeholder:text-base
            flex-1
          text-black-700"
        />

        {IconRightFamily && iconRightName && (
          <TouchableOpacity onPress={onIconRightPress}>
            <IconRightFamily name={iconRightName as any} size={22} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
