import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker, { ListModeType } from "react-native-dropdown-picker";

type Props = {
  value?: string;
  items: { value: string }[];
  onChange: (value: string) => void;
  label?: string;
  listMode?: ListModeType;
};

export function DropDownInput({ label, value, items, onChange, listMode }: Props) {
  const [open, setOpen] = useState(false);
  const [dropDownItems, setDropDownItems] = useState(items);

  return (
    <View className="gap-1">
      {label && <Text className="text-base">{label}</Text>}
      <DropDownPicker
        closeOnBackPressed={true}
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
        style={[styles.dropdownInput]}
        dropDownContainerStyle={[styles.optionsBox]}
        textStyle={[styles.optionsText]}
        placeholderStyle={[styles.placeholder]}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  dropdownInput: {
    zIndex: 1,
    backgroundColor: "#F4F6F8",
    minHeight: 45,
    borderWidth: 0.4,
    borderColor: "#9ca3af",
    borderRadius: 12,
    fontFamily: "Roboto-Regular",
    paddingLeft: 15,
    shadowColor: "rgba(0, 0, 0, 0.35)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  optionsBox: {
    backgroundColor: "#F4F6F8",
    borderColor: "#9ca3af",
    borderWidth: 0.5,
    paddingLeft: 4,
  },
  optionsText: {
    fontFamily: "Roboto-Regular",
  },
  placeholder: {
    fontFamily: "Roboto-Regular",
  },
  label: {
    marginBottom: 2,
  },
});
