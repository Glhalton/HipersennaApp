import { View, TouchableOpacity, Image, Text } from "react-native";
import { Href, router } from "expo-router";
import { styles } from "./style";

type Prop = {
    title: string,
    color?: string,
    backgroundColor?: string,
    screen?: Href;
}

export function Header({ title, color = "white", backgroundColor = "red", screen = "../../home"  }: Prop) {


    return (

        <View style={styles.header}>
            <TouchableOpacity style={styles.button} onPress={() => router.push(screen)}>
                <Image style={styles.gearIcon} source={require("../../../assets/images/white-arrow-100.png")} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    )
}