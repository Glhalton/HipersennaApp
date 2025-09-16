import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import React, { Fragment } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, useColorScheme, View } from "react-native";
import { Colors } from "../../../constants/colors";
import { styles } from "./styles";

type IconComponent = React.ComponentType<React.ComponentProps<typeof MaterialIcons>> |
    React.ComponentType<React.ComponentProps<typeof FontAwesome>> |
    React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
    IconLeft?: IconComponent,
    IconRight?: IconComponent,
    iconLeftName?: string,
    iconRightName?: string,
    label?: string,
    onIconLeftPress?: () => void,
    onIconRightPress?: () => void,
}

export function Input(Props: Props) {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const { IconLeft, IconRight, iconLeftName, iconRightName, label, onIconLeftPress, onIconRightPress, ...rest } = Props;

    return (
        <Fragment>
            {label &&
                <Text style={[styles.label, { color: theme.text}]}>{label}</Text>
            }
            <View style={[styles.boxInput, {backgroundColor: theme.inputColor}]}>
                {IconLeft && iconLeftName && (
                    <TouchableOpacity onPress={onIconLeftPress}>
                        <IconLeft name={iconLeftName as any} size={20} color={theme.iconColor} style={styles.iconLeft} />
                    </TouchableOpacity>
                )}
                <TextInput
                    style={[styles.input, { backgroundColor: theme.inputColor, color: theme.text}]}
                    placeholderTextColor={theme.inputPlaceholder}
                    
                    {...rest}
                />
                {IconRight && iconRightName && (
                    <TouchableOpacity onPress={onIconRightPress}>
                        <IconRight name={iconRightName as any} size={20} color={theme.iconColor} style={styles.iconRight} />
                    </TouchableOpacity>
                )}
            </View>
        </Fragment>
    )
}