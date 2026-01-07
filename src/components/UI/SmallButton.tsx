import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof MaterialCommunityIcons>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>
  | React.ComponentType<React.ComponentProps<typeof Ionicons>>;

type Props = TouchableOpacityProps & {
  IconFamily?: IconComponent;
  iconName?: string;
  iconSize?: number;
};

export function SmallButton({ iconSize, IconFamily, iconName, ...rest }: Props) {
  return (
    <TouchableOpacity
      {...rest}
      className=" shadow-lg  bg-[#F4F6F8] justify-center items-center border-hairline rounded-md  border-gray-400 size-11 "
    >
      <IconFamily name={iconName as any} size={iconSize} />
    </TouchableOpacity>
  );
}
