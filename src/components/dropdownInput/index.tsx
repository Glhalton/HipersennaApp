import React, { useState } from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./styles";

interface DropDownInputProps {
    label?: string;
    value: string | null;
    items: { value: string }[];
    onChange: (value: string) => void;
}

export function DropdownInput({label, value, items, onChange }: DropDownInputProps) {
    const [open, setOpen] = React.useState(false);
    const [dropDownItems, setDropDownItems] = React.useState(items);

    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <DropDownPicker
                open={open}
                value={value}
                items={dropDownItems}
                setOpen={setOpen}
                setValue={(callback) => {
                    const selected = callback(value);
                    onChange(selected as string);
                }}
                setItems={setDropDownItems}
                placeholder="Selecione uma opção"
                style={styles.dropdownInsercao}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={{
                    fontSize: 16,
                }}
                placeholderStyle={{
                    opacity: 0.6
                }}
            />
        </View>
    )
}