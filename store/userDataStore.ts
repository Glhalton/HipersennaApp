import { create } from "zustand";

interface UserDadosStore {
    token: string | null;
    setToken: (token: string) => void;
    userId: string | null;
    setUserId: (id: string | null) => void;
    name: string | null;
    setName: (name: string) => void;
    username: string | null;
    setUsername: (username: string) => void;
    nivelAcesso: string | null;
    setNivelAcesso: (nivel: string | null) => void;
}

export const userDataStore = create<UserDadosStore>((set) => ({
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