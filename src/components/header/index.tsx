import { View, TouchableOpacity, Image, Text } from "react-native";
import { Href, router } from "expo-router";
import { styles } from "./style";

type Prop = {
    title: string,
    color?: string,
    backgroundColor?: string,
    screen?: Href;
    navigationType?: NavigationType;
}

type NavigationType = "push" | "back" | "replace";

export function Header({ title, color = "white", backgroundColor = "red", screen = "../../home", navigationType = "push" }: Prop) {

    const handleNavigation = () => {
        if (navigationType === "push" && screen) {
            router.push(screen);
        } else if (navigationType === "replace" && screen) {
            router.replace(screen);
        } else if (navigationType === "back") {
            router.back();
        }
    };

    return (

        <View style={styles.header}>
            <TouchableOpacity style={styles.button} onPress={handleNavigation}>
                <Image style={styles.gearIcon} source={require("../../../assets/images/white-arrow-100.png")} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    )
}