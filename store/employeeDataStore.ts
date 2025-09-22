import { create } from "zustand";

interface UserDadosStore {
    token: string | null;
    userId: string | null;
    name: string | null;
    username: string | null;
    nivelAcesso: string | null;
    setToken: (token: string) => void;
    setUserId: (id: string | null) => void;
    setName: (name: string) => void;
    setUsername: (username: string) => void;
    setNivelAcesso: (nivel: string | null) => void;
}

export const employeeDataStore = create<UserDadosStore>((set) => ({
    token: null,
    userId: null,
    name: null,
    username: null,
    nivelAcesso: null,
    setToken: (token) => set({token: token}),
    setUserId: (id) => set({ userId: id }),
    setName: (name) => set({name: name}),
    setUsername: (username) => set({username: username}),
    setNivelAcesso: (nivel) => set({ nivelAcesso: nivel }),
}));