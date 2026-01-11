import { create } from "zustand";

type hsconsumption_groups = {
  id: number;
  description: string;
  created_at: string;
  modified_at: string;
};

type consumptionGroups = {
  consumptionGroups: hsconsumption_groups[] | null;
  setGroupsList: (products: hsconsumption_groups[]) => void;
  resetGroupsList: () => void;
};

export const consumptionGroupsStore = create<consumptionGroups>((set) => ({
  consumptionGroups: null,

  setGroupsList: (products) => set({ consumptionGroups: products }),
  resetGroupsList: () => set({ consumptionGroups: [] }),
}));
