import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./styles"; 

type Props = TouchableOpacityProps &{
    title: string,
    color?: string,
    backgroundColor?: string
}

export function LargeButton({title, color = "white", backgroundColor = "#DA0100", ...rest} :Props){

    return(
        <TouchableOpacity activeOpacity={0.5} style={[styles.button, {backgroundColor}]} {...rest}>
            <Text style={[styles.buttonText, {color}]}>{title}</Text>
        </TouchableOpacity>
    )
}

