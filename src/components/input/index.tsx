import React, { Fragment } from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from "react-native"
import { styles } from "./styles"
import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";

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

    const { IconLeft, IconRight, iconLeftName, iconRightName, label, onIconLeftPress, onIconRightPress, ...rest } = Props;

    return (
        <Fragment>
            {label &&
                <Text style={styles.label}>{label}</Text>
            }
            <View style={styles.boxInput}>
                {IconLeft && iconLeftName && (
                    <TouchableOpacity onPress={onIconLeftPress}>
                        <IconLeft name={iconLeftName as any} size={20} color={colors.gray} style={styles.iconLeft} />
                    </TouchableOpacity>
                )}
                <TextInput
                    style={styles.input}
                    {...rest}
                />
                {IconRight && iconRightName && (
                    <TouchableOpacity onPress={onIconRightPress}>
                        <IconRight name={iconRightName as any} size={20} color={colors.gray} style={styles.iconRight} />
                    </TouchableOpacity>
                )}
            </View>
        </Fragment>
    )
}