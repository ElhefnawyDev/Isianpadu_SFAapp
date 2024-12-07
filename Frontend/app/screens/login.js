import React, { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext.js";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { API_URL } from "../../env.js";

const { width } = Dimensions.get("window");

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken } = useContext(AuthContext);

  async function handleLogin() {
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();
    if (data.success) {
      setError("");
      setToken(data.token);
    } else {
      setError(data.message);
    }
  }

  // Dynamically adjust the image height based on the screen width
  const imageHeight = width > 400 ? "150%" : "120%"; // Example condition for larger screens

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logincircle.png")}
        style={[styles.image, { height: imageHeight }]} // Apply dynamic height
      />

      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Text style={styles.title}>SFA 360</Text>

      <Text style={styles.subtitle}>SIGN IN</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor="white"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="white"
        style={styles.input}
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "relative",
  },

  image: {
    width: "160%", // Default width for image
    resizeMode: "contain",
    position: "absolute",
    top: 80,
  },

  logo: {
    position: "absolute",
    top: "5%",
    height: 120,
    width: 120,
    resizeMode: "contain",
  },

  title: {
    position: "absolute",
    top: "20%",
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    position: "absolute",
    top: "28%",
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginVertical: 10,
    paddingHorizontal: 10,
    fontSize: 20,
    color: "white",
  },
  error: {
    color: "red",
    marginTop: 5,
  },
  loginButton: {
    position: "absolute",
    bottom: "30%",
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 20,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
