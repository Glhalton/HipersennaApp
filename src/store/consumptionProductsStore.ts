import { create } from "zustand";

type hsconsumptionProducts = {
  id: number;
  consumption_id: number | null;
  employee_id: number;
  branch_id: number;
  product_code: number;
  auxiliary_code: string;
  quantity: number;
  group_id: number;
  created_at: string;
  modified_at: string;
  description: string;
  hsconsumption_groups: {
    id: number;
    description: string;
    created_at: string;
    modified_at: string;
  };
};

type consumptionProducts = {
  consumptionProducts: hsconsumptionProducts[] | null;
  setProductsList: (products: hsconsumptionProducts[]) => void;
  resetProductsList: () => void;
};

export const consumptionProductsStore = create<consumptionProducts>((set) => ({
  consumptionProducts: null,

  setProductsList: (products) => set({ consumptionProducts: products }),
  resetProductsList: () => set({ consumptionProducts: [] }),
}));
