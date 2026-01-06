import AsyncStorage from "@react-native-async-storage/async-storage";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if(response.status === 401){
    throw new Error('Não ')
  }

}
