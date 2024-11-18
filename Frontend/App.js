import React, { useContext } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthProvider, AuthContext } from "./AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import DashboardScreen from "./app/screens/Dashboard";
import TenderStageScreen from "./app/screens/TenderStage";
import NoticeBoardScreen from "./app/screens/NoticeBoard";
import SavedScreen from "./app/screens/Saved";
import Login from "./app/screens/login";
import DrawerItems from "./app/constants/DrawerItems";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const maleProfileImage = require("./app/assets/navbar-logo.png"); // Replace with your image path
const femaleProfileImage = require("./app/assets/UserFemale.png"); // Replace with your image path
const alienProfileImage = require("./app/assets/AlienUser.png"); // Replace with your image path

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { userInfo } = useContext(AuthContext); // Access userInfo from AuthContext

  // Check if userInfo is null or undefined
  const profileImage = userInfo
    ? userInfo.gender === "L"
      ? maleProfileImage
      : userInfo.gender === "P"
      ? femaleProfileImage
      : alienProfileImage
    : alienProfileImage; // Fallback to alien profile image if userInfo is null

  const userName = userInfo ? userInfo.name : "Admin"; // Fallback to "Admin" if userInfo is null
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
      <Image source={profileImage} style={styles.profileImage} />
      <Text style={styles.headerText}>
          Hi <Text style={styles.headerNameText}>{userInfo ? userInfo.name : "Admin"}</Text> {/* Fallback to "Admin" if name is not available */}
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function AppNavigation() {
  const { token, removeToken } = useContext(AuthContext);
  
  // Logout function
  const handleLogout = () => {
    removeToken(); // Remove the token and reset the auth state
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Main">
            {() => (
              <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                drawerType="front"
                initialRouteName="Dashboard"
                screenOptions={{
                  drawerActiveTintColor: "#3953cd",
                  drawerItemStyle: { marginVertical: 10 },
                  headerBackground: () => (
                    <LinearGradient
                      colors={["#4361EE", "#405de5"]}
                      style={{ flex: 1 }}
                    />
                  ),
                  headerTintColor: "#ffff",
                  headerTitleAlign: "center",
                }}
              >
                <Drawer.Screen
                  name="Dashboard"
                  component={DashboardScreenWithLogout} // Add Dashboard with logout button
                  options={{
                    drawerIcon: ({ focused }) => (
                      <MaterialCommunityIcons
                        name="view-dashboard"
                        size={24}
                        color={focused ? "#3953cd" : "black"}
                      />
                    ),
                    // Add logout button to the top-right of the Dashboard screen header
                    headerRight: () => (
                      <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.logoutButton}
                      >
                        <Text style={styles.logoutText}>Logout</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
                {DrawerItems.map((drawer) => (
                  <Drawer.Screen
                    key={drawer.name}
                    name={drawer.name}
                    component={(() => {
                      switch (drawer.name) {
                        case "TenderStage":
                          return TenderStageScreen;
                        case "Notice Board":
                          return NoticeBoardScreen;
                        default:
                          return DashboardScreen; // Default fallback screen
                      }
                    })()}
                    options={{
                      drawerIcon: ({ focused }) =>
                        drawer.iconType === "Material" ? (
                          <MaterialCommunityIcons
                            name={drawer.iconName}
                            size={24}
                            color={focused ? "#3953cd" : "black"}
                          />
                        ) : drawer.iconType === "Feather" ? (
                          <Feather
                            name={drawer.iconName}
                            size={24}
                            color={focused ? "#3953cd" : "black"}
                          />
                        ) : (
                          <FontAwesome5
                            name={drawer.iconName}
                            size={24}
                            color={focused ? "#3953cd" : "black"}
                          />
                        ),
                    }}
                  />
                ))}
              </Drawer.Navigator>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// This component wraps DashboardScreen to provide logout functionality
function DashboardScreenWithLogout({ navigation }) {
  const { removeToken } = useContext(AuthContext); // Access removeToken from context

  // Logout function
  const handleLogout = () => {
    removeToken(); // Remove token and clear auth context
    navigation.navigate("Login"); // Navigate back to login
  };

  return (
    <DashboardScreen
      headerRight={() => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    alignItems: "start",
    padding: 20,
    backgroundColor: "#ffff",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  headerNameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },
  logoutButton: {
    padding: 10,
    marginRight: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default App;
