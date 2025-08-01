import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./styles";

export function DropInput(){

    const[tipoInsercao, setTipoInsercao] = React.useState(null);

    const[open, setOpen] = React.useState(false);
    const [tiposInsecao, setTiposInsercao] = React.useState([
        {label: "Tipo1", value: "tipo1"},
        {label: "Tipo2", value: "tipo2"},
        {label: "Tipo3", value: "tipo3"}
    ]);

    return(
        <DropDownPicker
            open={open}
            value={tipoInsercao}
            items={tiposInsecao}
            setOpen={setOpen}
            setValue={setTipoInsercao}
            setItems={setTiposInsercao}
            placeholder="Selecione o tipo de inserção"
            style={styles.dropdownInsercao}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={{
                fontSize: 16,
            }}
            placeholderStyle={{
                opacity: 0.6
            }}
        />
    )
}