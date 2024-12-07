import { useState, useEffect, useRef, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Platform,
} from "react-native";
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
  Ionicons,
} from "@expo/vector-icons";
import DashboardScreen from "./app/screens/Dashboard";
import TenderStageScreen from "./app/screens/TenderStage";
import NoticeBoardScreen from "./app/screens/NoticeBoard";
import SavedScreen from "./app/screens/Saved";
import Login from "./app/screens/login";
import DrawerItems from "./app/constants/DrawerItems";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import FloatableButtonScreen from "./app/components/FloatingButton";
import ChatScreen from "./app/screens/chat";
import ChatBot from "./app/screens/ChartsScreen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { API_URL } from "./env";
import { apiClient } from "./apiClient";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const maleProfileImage = require("./app/assets/navbar-logo.png"); // Replace with your image path
const femaleProfileImage = require("./app/assets/UserFemale.png"); // Replace with your image path
const alienProfileImage = require("./app/assets/AlienUser.png"); // Replace with your image path

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

async function scheduleTenderNotification(tender) {
  const tenderDeadline = new Date(tender.deadline);
  const formattedDeadline = `${tenderDeadline
    .getDate()
    .toString()
    .padStart(2, "0")}/${(tenderDeadline.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${tenderDeadline.getFullYear()}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Tender Deadline Alert!",
      body: `Tender ${tender.tender_shortname} is approaching its deadline: ${formattedDeadline}`,
      data: { tenderId: tender.tender_id },
    },
    trigger: { seconds: 5 }, // Adjust for testing purposes
  });
}

async function fetchTenderData(userId) {
  try {
    const tenderData = await apiClient(`/sfa_tender`);
    if (tenderData.success) {
      const currentDate = new Date();
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(currentDate.getMonth() + 1);

      // Filter tenders first by id_adm_profileSP before further checks
      const userTenders = tenderData.tenders.filter(
        (tender) => tender.id_adm_profileSP === userId
      );

      // Further filter by deadline
      const filteredTenders = userTenders.filter((tender) => {
        const tenderDeadline =
          tender.deadline && tender.deadline !== "null"
            ? new Date(tender.deadline)
            : null;

        // Log details for testing
        console.log(`Processing Tender: ${tender.tender_shortname}`);
        console.log(`Tender Deadline: ${tenderDeadline}`);
        console.log(`Current Date: ${currentDate}`);
        console.log(`One Month From Now: ${oneMonthFromNow}`);

        return (
          tenderDeadline &&
          tenderDeadline > currentDate &&
          tenderDeadline <= oneMonthFromNow
        );
      });

      // Debugging: Log filtered tenders for the specific user
      console.log("Filtered Tenders:", filteredTenders);

      // Schedule notifications for filtered tenders
      filteredTenders.forEach((tender) => {
        console.log(
          `Scheduling notification for tender: ${tender.tender_shortname}`
        );
        scheduleTenderNotification(tender);
      });
    }
  } catch (error) {
    console.error("Error fetching tenders:", error.message);
  }
}

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
          Hi{" "}
          <Text style={styles.headerNameText}>
            {userInfo ? userInfo.name : "Admin"}
          </Text>{" "}
          {/* Fallback to "Admin" if name is not available */}
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function AppNavigation() {
  const { token, removeToken, userInfo } = useContext(AuthContext);
  const res = JSON.stringify(userInfo);
  console.log("resid: " + res);

  useEffect(() => {
    if (token && userInfo) {
      const parsedRes = JSON.parse(res); // Parse the string back into an object
      if (parsedRes?.user?.id_profile) {
        fetchTenderData(parsedRes.user.id_profile);
        console.log("user id:", parsedRes.user.id_profile);
      } else {
        console.warn("User ID not found in response.");
      }
    }
  }, [token]); // Remove userInfo as a dependency to prevent unnecessary triggers.

  // Logout function
  const handleLogout = () => {
    removeToken(); // Remove the token and reset the auth state
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
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
                        case "ChatBot":
                          return ChatScreen;
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
                        ) : drawer.iconType === "FontAwesome5" ? (
                          <FontAwesome5
                            name={drawer.iconName}
                            size={24}
                            color={focused ? "#3953cd" : "black"}
                          />
                        ) : (
                          <Ionicons
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
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return (
    <AuthProvider>
      {/* <FloatableButtonScreen></FloatableButtonScreen> */}

      <AppNavigation />
    </AuthProvider>
  );
};
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Push token:", token);
  } else {
    alert("Must use a physical device for push notifications");
  }

  return token;
}

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
