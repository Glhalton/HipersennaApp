import { Colors } from "@/constants/colors";
import React, { Fragment } from "react";
import { Text, useColorScheme, View } from "react-native";
import DropDownPicker, { ListModeType } from "react-native-dropdown-picker";
import { styles } from "./styles";

interface DropDownInputProps {
  value: string | null;
  items: { value: string }[];
  onChange: (value: string) => void;
  label?: string;
  listMode?: ListModeType;
}

export function DropdownInput({ label, value, items, onChange, listMode }: DropDownInputProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [open, setOpen] = React.useState(false);
  const [dropDownItems, setDropDownItems] = React.useState(items);

  return (
    <Fragment>
      {label && <Text style={[styles.label, { color: theme.title }]}>{label}</Text>}
      <View style={[styles.container, { backgroundColor: theme.inputColor }]}>
        <DropDownPicker
          listMode={listMode}
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
          style={[styles.dropdownInput, { backgroundColor: theme.inputColor, borderColor: theme.inputBorder }]}
          dropDownContainerStyle={[styles.optionsBox, { backgroundColor: theme.inputColor, borderColor: theme.inputBorder }]}
          textStyle={[styles.optionsText, { color: theme.title }]}
          placeholderStyle={[styles.placeholder, { color: theme.text }]}
        />
      </View>
    </Fragment>
  );
}
