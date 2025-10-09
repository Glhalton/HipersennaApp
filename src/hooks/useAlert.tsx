import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>;

type AlertOptions = {
  title: string;
  text: string;
  icon: string;
  color: string;
  iconFamily: IconComponent;
  onClose?: () => void;
};

export function useAlert() {
  const [visible, setVisible] = useState(false);
  const [alertData, setAlertData] = useState<AlertOptions | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertData(options);
    setVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    if (alertData?.onClose) alertData.onClose();
    setVisible(false);
  }, [alertData]);

  return {
    visible,
    alertData,
    showAlert,
    hideAlert,
  };
}
