import { View, Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import colors from "../../../constants/colors";


type Props = TouchableOpacityProps & {
    text: string,
    color?: string,
    backgroundColor?: string,
    loading?: boolean,
}

export function LargeButton({ text, color = "white", backgroundColor = colors.red2, loading, ...rest }: Props) {

    return (
        <View>
            <TouchableOpacity
                style={[styles.button, { backgroundColor }]}
                activeOpacity={0.6}
                {...rest}
            >
                {loading ? <ActivityIndicator /> : <Text style={[styles.textButton, { color }]}>{text}</Text>}
            </TouchableOpacity>
        </View>

    )
}

