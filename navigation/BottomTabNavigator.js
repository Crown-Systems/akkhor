import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen.js";
import RegisterScreen from "../screens/RegisterScreen";
import SelectCategoryScreen from "../screens/SelectCategoryScreen";
import SettingsScreen from "../screens/SettingsScreen.js";
import MarketplaceScreen from "../screens/MarketplaceScreen.js";
import AchievementsScreen from "../screens/AchievementsScreen.js";
import LeaderboardScreen from "../screens/LeaderboardScreen.js";
import { useTheme } from "../components/ThemeContext.js";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "HomeScreen";

export default function BottomTabNavigator({
  setLoggedIn,
  isLoggedIn,
  setCategory,
  levelId,
  userId,
  myUserSettings,
  authToken,
  setAuthToken,
  handleLogout,
  userDetails,
}) {
  const { colors, isDark, setScheme } = useTheme();

  React.useEffect(() => {
    if (myUserSettings) {
      var dataSideColour = myUserSettings.find(
        (az) =>
          az.id > 0 && az.setting && az.setting.description === "App Dark Mode"
      );
      if (dataSideColour) {
        setScheme(dataSideColour.rawValue);
      }
    }
  }, [myUserSettings]);

  return (
    <BottomTab.Navigator
      barStyle={{ backgroundColor: "#fff" }}
      initialRouteName={
        isLoggedIn ? "SelectCategoryScreen" : INITIAL_ROUTE_NAME
      }
      tabBarOptions={{
        showLabel: false,
        headerShown: false,
        tabBarVisible: false,
        style: {
          backgroundColor: isDark ? colors.background : "#fff",
          border: "none",
          display: isLoggedIn ? "flex" : "none",
        },
      }}
    >
      {isLoggedIn ? (
        <React.Fragment>
          <BottomTab.Screen
            name="ChooseCategory"
            options={{
              title: "ChooseCategory",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="md-infinite" />
              ),
            }}
          >
            {(props) => (
              <SelectCategoryScreen
                {...props}
                authToken={authToken}
                setCategory={setCategory}
                userDetails={userDetails}
              />
            )}
          </BottomTab.Screen>
          <BottomTab.Screen
            name="MarketplaceScreen"
            options={{
              title: "MarketplaceScreen",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="md-basket" />
              ),
            }}
          >
            {(props) => (
              <MarketplaceScreen
                {...props}
                authToken={authToken}
                userId={userId}
                levelId={levelId}
                myUserSettings={myUserSettings}
                setCategory={setCategory}
                handleLogout={handleLogout}
                userDetails={userDetails}
              />
            )}
          </BottomTab.Screen>
          <BottomTab.Screen
            name="LeaderboardScreen"
            options={{
              title: "LeaderboardScreen",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="md-trophy" />
              ),
            }}
          >
            {(props) => (
              <LeaderboardScreen
                {...props}
                authToken={authToken}
                userId={userId}
                levelId={levelId}
                myUserSettings={myUserSettings}
                setCategory={setCategory}
                handleLogout={handleLogout}
                userDetails={userDetails}
              />
            )}
          </BottomTab.Screen>
          <BottomTab.Screen
            name="AchievementsScreen"
            options={{
              title: "AchievementsScreen",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="md-pulse" />
              ),
            }}
          >
            {(props) => (
              <AchievementsScreen
                {...props}
                authToken={authToken}
                userId={userId}
                levelId={levelId}
                myUserSettings={myUserSettings}
                setCategory={setCategory}
                handleLogout={handleLogout}
                userDetails={userDetails}
                authToken={authToken}
              />
            )}
          </BottomTab.Screen>
          <BottomTab.Screen
            name="Settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="md-settings" />
              ),
            }}
          >
            {(props) => (
              <SettingsScreen
                {...props}
                authToken={authToken}
                userId={userId}
                levelId={levelId}
                myUserSettings={myUserSettings}
                setCategory={setCategory}
                handleLogout={handleLogout}
              />
            )}
          </BottomTab.Screen>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <BottomTab.Screen
            name="HomeScreen"
            options={{
              title: "HomeScreen",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="logo-game-controller-b" />
              ),
            }}
          >
            {(props) => (
              <HomeScreen
                {...props}
                authToken={authToken}
                setLoggedIn={setLoggedIn}
              />
            )}
          </BottomTab.Screen>
          <BottomTab.Screen
            name="Register"
            options={{
              title: "Register",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="logo-game-controller-b" />
              ),
            }}
          >
            {(props) => (
              <RegisterScreen
                {...props}
                setAuthToken={setAuthToken}
                setLoggedIn={setLoggedIn}
              />
            )}
          </BottomTab.Screen>
          <BottomTab.Screen
            name="Login"
            options={{
              title: "Login",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="md-person" />
              ),
            }}
          >
            {(props) => (
              <LoginScreen
                {...props}
                setAuthToken={setAuthToken}
                setLoggedIn={setLoggedIn}
              />
            )}
          </BottomTab.Screen>
          <BottomTab.Screen
            name="ForgotPassword"
            options={{
              title: "ForgotPassword",
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="md-person" />
              ),
            }}
          >
            {(props) => (
              <ForgotPasswordScreen
                {...props}
                setAuthToken={setAuthToken}
                setLoggedIn={setLoggedIn}
              />
            )}
          </BottomTab.Screen>
        </React.Fragment>
      )}
    </BottomTab.Navigator>
  );
}
