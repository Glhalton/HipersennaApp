import React, { Fragment, useState } from "react";
import { View, Text, useColorScheme } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./styles";
import { Colors } from "../../../constants/colors";

interface DropDownInputProps {
    value: string | null;
    items: { value: string }[];
    onChange: (value: string) => void;
    label?: string;
}

export function DropdownInput({ label, value, items, onChange }: DropDownInputProps) {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const [open, setOpen] = React.useState(false);
    const [dropDownItems, setDropDownItems] = React.useState(items);

    return (
        <Fragment>
            {label && (
                <Text style={[styles.label, { color: theme.text }]}>
                    {label}
                </Text>
            )}
            <View style={[styles.container, { backgroundColor: theme.inputColor }]}>
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
                    style={[styles.dropdownInput, { backgroundColor: theme.inputColor }]}
                    dropDownContainerStyle={[styles.optionsBox, { backgroundColor: theme.inputColor }]}
                    textStyle={[styles.optionsText, { color: theme.text }]}
                    placeholderStyle={[styles.placeholder, { color: theme.text }]}
                />
            </View>
        </Fragment>

    )
}