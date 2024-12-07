import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./env";
import { AuthContext } from "./AuthContext";

export const apiClient = (endpoint, options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json",
      };


      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        console.log("Unauthorized. Logging out...");
        const authContext = AuthContext._currentValue; 
        if (authContext?.removeToken) {
          authContext.removeToken(); 
        }
        reject(new Error("Unauthorized: Token expired or invalid"));
        return;
      }

      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.error("API request error:", error);
      reject(error);
    }
  });
};
