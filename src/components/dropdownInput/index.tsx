import React, { useState } from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./styles";

interface DropDownInputProps {
    value: string | null;
    items: { value: string }[];
    onChange: (value: string) => void;
}

export function DropdownInput({ value, items, onChange }: DropDownInputProps) {
    const [open, setOpen] = React.useState(false);
    const [dropDownItems, setDropDownItems] = React.useState(items);

    return (
        <View style={{   zIndex: 1000,}}>
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
                textStyle={styles.dropdownText}
                placeholderStyle={styles.placeholder}

            />
        </View>
    )
}