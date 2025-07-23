import React, {useState} from "react";
import { View, Text } from "react-native";
import { DateInput } from "@/components/dateInput";

export default function Historico(){

    const [dataVencimento, setDataVencimento] = useState(new Date());

    return (
        <View>
            <DateInput
                label = "Data de Vencimento"
                value={dataVencimento}
                onChange={(novaData) => setDataVencimento(novaData)}
            />
        </View>
    )
}