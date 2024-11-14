// App.js
import React, { useContext } from "react";
import { Text, View, StyleSheet, Image, SafeAreaView } from "react-native";
import ProgressCards from "./app/screens/ProgressCards";
import Login from "./app/screens/login";
import { AuthProvider, AuthContext } from "./AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TargetProgress from "./app/screens/TargetProgress";
import TenderStageScreen from "./app/screens/TenderStage";
import NoticeBoardScreen from "./app/screens/NoticeBoard";
import SavedScreen from "./app/screens/Saved";
import { LinearGradient } from "expo-linear-gradient";
import TableScreen from "./app/components/TableTopWonClient";
import DashboardScreen from "./app/screens/Dashboard";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import DrawerItems from "./app/constants/DrawerItems";
import {
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import TableTopCategory from "./app/components/TableTopCategory";

const profileImage = require("./app/assets/navbar-logo.png"); // Replace with your image path

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.headerText}>Hi Admin,</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
function AppNavigator() {
  const { token } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Login" component={MainMenu} />
        ) : (
          // <Stack.Screen name="ProgressCards">
          //   {(props) => <ProgressCards {...props} year={2024} />}
          // </Stack.Screen>
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainMenu() {
  return (
    <NavigationContainer>
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
          headerTintColor: "#fff", // Set the color of the header text and icons here
          headerTitleAlign: "center", // Center the header title
        }}
      >
        {DrawerItems.map((drawer) => (
          <Drawer.Screen
            key={drawer.name}
            name={drawer.name}
            component={(() => {
              switch (drawer.name) {
                case "Dashboard":
                  return DashboardScreen;
                case "TenderStage":
                  return TenderStageScreen;
                case "Saved Items":
                  return SavedScreen;
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
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <MainMenu/>
    </AuthProvider>
    // <SafeAreaView style={styles.safeArea}>
    //   <TableScreen year={2024} />
    //   {/* <DashboardScreen></DashboardScreen> */}
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" }, // Adjust background as needed
});

export default App;
