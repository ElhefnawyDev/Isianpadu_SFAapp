import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./env.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null); // Add userInfo state to store the user data

  // Function to save the token to AsyncStorage
  const saveToken = async (userToken) => {
    try {
      await AsyncStorage.setItem("userToken", userToken);
      setToken(userToken);
      if (!userToken) return;

      console.log("Token saved.");
      const localToken = await AsyncStorage.getItem("userToken");

      if (localToken) {
        setToken(localToken);
      }
    } catch (error) {
      console.error("Failed to save token to AsyncStorage", error);
    }
  };

  // Fetch user information based on token
  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/user/token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token is invalid or expired
        console.log("Token expired or invalid, logging out");
        removeToken();
        return;
      }

      const info = await response.json();
      delete info.userId;
      console.log(`User info: ${JSON.stringify(info)}`);
      setUserInfo(info); // Save user info in state
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  // Function to remove the token from AsyncStorage (logout)
  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setToken(null);
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken: saveToken, removeToken, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
