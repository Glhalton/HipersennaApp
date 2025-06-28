import { TextInput, TextInputProps } from "react-native"
import {styles} from "./styles"

type Props = TextInputProps & {

}

export function Input({...rest} :Props){
    return(
        <TextInput
            style={styles.input}
            {...rest}
        />
    )
}