import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker, { ListModeType } from "react-native-dropdown-picker";

type Props = {
  value?: string;
  items: { value: string }[];
  onChange: (value: string) => void;
  label?: string;
  listMode?: ListModeType;
};

export function OrdinationButton({ label, value, items, onChange, listMode }: Props) {
  const [open, setOpen] = useState(false);
  const [dropDownItems, setDropDownItems] = useState(items);

  return (
    <View className="">
      <DropDownPicker
        open={open}
        value={value}
        placeholder="Selecione uma opção"
        items={dropDownItems}
        setOpen={setOpen}
        setValue={(callback) => {
          const selected = callback(value);
          onChange(selected as string);
        }}
        setItems={setDropDownItems}
        style={[styles.dropdownInput, { backgroundColor: colors.black[700] }]}
        dropDownContainerStyle={[styles.optionsBox, { backgroundColor: colors.black[700] }]}
        textStyle={[styles.optionsText, { color: colors.white[500] }]}
        placeholderStyle={[styles.placeholder]}
        ArrowDownIconComponent={() => <Ionicons name="chevron-down-outline" size={20} color={"white"} />}
        ArrowUpIconComponent={() => <Ionicons name="chevron-up-outline" size={20} color={"white"} />}
        TickIconComponent={() => <Ionicons name="checkmark" size={20} color={"white"} />}
      />
    </View>
  );
}
export const styles = StyleSheet.create({
  dropdownInput: {
    minHeight: 20,
    width: 140,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 20,
  },
  optionsBox: {
    minHeight: 20,
    width: 140,
    borderColor: "gray",
    borderWidth: 0,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  optionsText: {
    fontFamily: "Roboto-SemiBold",
  },
  placeholder: {
    fontFamily: "Roboto-SemiBold",
  },
});
