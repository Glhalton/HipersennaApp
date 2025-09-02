import DateTimePicker from "@react-native-community/datetimepicker";
import React, { Fragment, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";

interface DateInputProps {
    label?: string,
    placeholder?: string;
    value?: Date;
    onChange: (date: Date) => void;
}

export function DateInput({ label, placeholder, value, onChange }: DateInputProps) {

    const [show, setShow] = useState(false);

    const handleChange = (_event: any, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) {
            onChange(selectedDate);
        }
    };


    return (
        <Fragment>
            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>)
            }
            <View style={styles.container}>

                <Pressable style={styles.dataInputBox} onPress={() => setShow(true)}>
                    <Text style={[styles.dataInputText, !value && { color: "#555" }]}>
                        {value ? value.toLocaleDateString("pt-BR") : placeholder}
                    </Text>
                </Pressable>

                {show && (
                    <DateTimePicker
                        value={value || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={handleChange}
                    />
                )}
            </View>
        </Fragment>

    );
}