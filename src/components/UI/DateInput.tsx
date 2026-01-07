import { Colors } from "@/constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";

interface DateInputProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange: (date: Date) => void;
}

export function DateInput({ label, placeholder, value, onChange }: DateInputProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View className="gap-1">
      {label && <Text>{label}</Text>}
      <View className="border-hairline border-gray-400 rounded-xl px-4 h-12  justify-center shadow-lg bg-[#F4F6F8]">
        <Pressable onPress={() => setShow(true)}>
          <Text className={`${value ? "text-black-700" : "text-[#6B7280]"} `}>
            {value ? value.toLocaleDateString("pt-BR") : placeholder}
          </Text>
        </Pressable>

        {show && <DateTimePicker value={value || new Date()} mode="date" display="spinner" onChange={handleChange} />}
      </View>
    </View>
  );
}
