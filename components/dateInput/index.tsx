import React, {useState} from "react";
import { Pressable, Text, View } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from "./styles"

interface DateInputProps {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
}

export function DateInput({label, value, onChange} : DateInputProps){

    const [show, setShow] = useState(false);

    const handleChange = (_event: any, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) {
        onChange(selectedDate);
        }
    };


    return(
        <View style={styles.container}>
            <Pressable style={styles.inputData} onPress={() => setShow(true)}>
                <Text style={styles.inputDataText}>
                    {value.toLocaleDateString('pt-BR')}
                </Text>
            </Pressable>

            {show && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="spinner"
                    onChange={handleChange}
                />
            )}
        </View>
    );
}