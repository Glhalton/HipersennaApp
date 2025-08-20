import { create } from "zustand";

type UserDadosStore = {
    userId: string | null;
    setUserId: (id: string | null) => void;
    nivelAcesso: string | null;
    setNivelAcesso: (nivel: string | null) => void;
}

export const useUserDadosStore = create<UserDadosStore>((set) => ({
    userId: null,
    setUserId: (id) => set({ userId: id }),
    nivelAcesso: null,
    setNivelAcesso: (nivel) => set({ nivelAcesso: nivel }),
}));