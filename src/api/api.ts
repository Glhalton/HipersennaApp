import AsyncStorage from "@react-native-async-storage/async-storage";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch(endpoint: string, { auth = true, headers, ...options }: ApiFetchOptions = {}) {
  const token = auth ? await AsyncStorage.getItem("token") : null;

  const hasBody = !!options.body;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Erro na requisição");
  }

  return data;
}
