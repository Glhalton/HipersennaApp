import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: React.ReactNode;
};

export function Screen({ children }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1  px-5 pt-5" edges={["bottom"]}>
      {children}
    </SafeAreaView>
  );
}
