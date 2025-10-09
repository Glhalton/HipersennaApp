import React, { Fragment } from "react";
import { Text, useColorScheme, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Colors } from "../../constants/colors";
import { styles } from "./styles";

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
      {label && <Text style={[styles.label, { color: theme.title }]}>{label}</Text>}
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
          textStyle={[styles.optionsText, { color: theme.title }]}
          placeholderStyle={[styles.placeholder, { color: theme.text }]}
        />
      </View>
    </Fragment>
  );
}
