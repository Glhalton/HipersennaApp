import { create } from "zustand";

type hsconsumption_groups = {
  id: number;
  description: string;
  created_at: string;
  modified_at: string;
};

type consumptionGroupsStore = {
  consumptionGroups: hsconsumption_groups[] | null;
  setGroupsList: (products: hsconsumption_groups[]) => void;
  resetGroupsList: () => void;
};

export const consumptionGroupsStore = create<consumptionGroupsStore>((set) => ({
  consumptionGroups: null,

  setGroupsList: (products) => set({ consumptionGroups: products }),
  resetGroupsList: () => set({ consumptionGroups: [] }),
}));
