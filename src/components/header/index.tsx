import { View, TouchableOpacity, Image, Text } from "react-native";
import { router } from "expo-router";
import { styles } from "./style";

type Prop = {
    text: string;
}

export function Header({text}: Prop){

    const botaoVoltar = () => {
        router.back();
    }

    return(
        <View style={styles.container}>

            <TouchableOpacity onPress={botaoVoltar}>
                <Image style={styles.arrowImg} source={require("../../../assets/images/LeftArrow.png")}/>
            </TouchableOpacity>

            <View style={styles.containerTitle}>
                <Text style={styles.title}>
                    {text}
                </Text>
            </View>

        </View>
    )
}