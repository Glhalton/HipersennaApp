import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Colors } from "../constants/colors";
import { employeeDataStore } from "../store/employeeDataStore";

export function useUserData(url: string, showAlert: any) {

  const [validities, setValidities] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const setName = employeeDataStore((state) => state.setName);
  const setUsername = employeeDataStore((state) => state.setUsername);
  const setWinthorId = employeeDataStore((state) => state.setWinthorId);
  const setId = employeeDataStore((state) => state.setUserId);
  const setBranchId = employeeDataStore((state) => state.setBranchId);
  const setAccessLevel = employeeDataStore((state) => state.setAccessLevel);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const [userRes, validitiesRes, requestsRes] = await Promise.all([
        fetch(`${url}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${url}/validities/employee`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${url}/validity-requests/employee`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const userData = await userRes.json();
      const validitiesData = await validitiesRes.json();
      const requestsData = await requestsRes.json();

      if (userRes.ok) {
        setId(userData.id);
        setName(userData.name);
        setUsername(userData.username);
        setBranchId(userData.branch_id);
        setAccessLevel(userData.access_level);
        setWinthorId(userData.winthor_id);
      } else {
        showAlert({
          title: "Erro!",
          text: userData.message,
          color: Colors.red,
          icon: "error-outline",
          iconFamily: MaterialIcons,
        });
      }

      if (validitiesData.validitiesByEmployee) {
        setValidities(validitiesData.validitiesByEmployee);
      } else {
        showAlert({
          title: "Erro!",
          text: validitiesData.message,
          color: Colors.red,
          icon: "error-outline",
          iconFamily: MaterialIcons,
        });
      }

      if (requestsData.validityRequestsByEmployee) {
        setRequests(requestsData.validityRequestsByEmployee);
      } else {
        showAlert({
          title: "Erro!",
          text: requestsData.message,
          color: Colors.red,
          icon: "error-outline",
          iconFamily: MaterialIcons,
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error.message}`,
        color: Colors.red,
        icon: "error-outline",
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {validities, requests, isLoading}
}
