import React, { Fragment, useState } from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from "./styles";

interface DropDownInputProps {
    value: string | null;
    items: { value: string }[];
    onChange: (value: string) => void;
    label?: string;
}

export function DropdownInput({label, value, items, onChange }: DropDownInputProps) {
    const [open, setOpen] = React.useState(false);
    const [dropDownItems, setDropDownItems] = React.useState(items);

    return (
        <Fragment>
            { label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}
            <View style={styles.container}>
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
                    style={styles.dropdownInput}
                    dropDownContainerStyle={styles.optionsBox}
                    textStyle={styles.optionsText}
                    placeholderStyle={styles.placeholder}
                />
            </View>
        </Fragment>

    )
}