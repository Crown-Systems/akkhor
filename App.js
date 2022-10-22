import * as React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import * as Font from "expo-font";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import GlobalSettingsProvider, {
  GlobalSettingsContext,
} from "./context/GlobalSettingsProvider.js";
import AvailableUserSettingsProvider, {
  AvailableUserSettingsContext,
} from "./context/AvailableUserSettingsProvider.js";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import useLinking from "./navigation/useLinking";
import QuestionScreen from "./screens/QuestionScreen";
import CategoryLevelsScreen from "./screens/SelectLevelScreen.js";
import InterstitialAdvertScreen from "./screens/InterstitialAdvertScreen.js";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppearanceProvider } from "react-native-appearance";
import { useTheme, ThemeProvider } from "./components/ThemeContext.js";
import TabBarIcon from "./components/TabBarIcon";

import * as InAppPurchases from "expo-in-app-purchases";

import { backendUrl } from "./constants/Environment.js";
import { AuthProvider } from "./context/AuthenticationProvider.js";
import MarketplaceItemsProvider from "./constants/MarketplaceItems.js";
import { provider, ProviderComposer } from "./context/providers.js";

const Stack = createStackNavigator();

export default function AppWrapper() {
  return (
    <ProviderComposer
      providers={[
        provider(GlobalSettingsProvider),
        provider(AvailableUserSettingsProvider),
        provider(MarketplaceItemsProvider),
      ]}
    >
      <App />
    </ProviderComposer>
  );
}

function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  const [myLevelId, setMyLevelId] = React.useState(-1);
  const [myCategoryId, setMyCategoryId] = React.useState(-1);

  const [myUsername, setMyUsername] = React.useState("");
  const [myAuthToken, setMyAuthToken] = React.useState("");

  const [myUserId, setMyUserId] = React.useState(-1);
  const [myUserSettings, setMyUserSettings] = React.useState([]);

  const [myUserInfo, setMyUserInfo] = React.useState([]);

  const [showBannerAds, setShowBannerAds] = React.useState(false);

  const { colors, isDark, setScheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    containerInside: {
      flex: 12,
    },
    bottomView: {
      flex: 1,
    },
  });

  /**
   * The name of the cookies in the browser.
   */
  const authName = "authentication_data";

  /**
   * For managing global settings like [app version]
   */
  const { saveGlobalSettingsMany } = React.useContext(GlobalSettingsContext);

  /**
   * For managing available user settings like [app dark mode]
   */
  const { saveAvailableSettingsMany } = React.useContext(
    AvailableUserSettingsContext
  );

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        /**
         * Load our initial navigation state
         */
        setInitialNavigationState(await getInitialState());

        /**
         * Load our fonts
         */
        await Font.loadAsync({
          "montserrat-light": require("./assets/fonts/Montserrat-Light.ttf"),
        });
        await Font.loadAsync({
          "Montserrat-Light": require("./assets/fonts/Montserrat-Light.ttf"),
        });
        await Font.loadAsync({
          MontserratLight: require("./assets/fonts/Montserrat-Light.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
      }
    }

    /**
     * For managing user authentication via tokens
     */
    async function setAuthTokenData() {
      /**
       * There are two main functionalities here, one for logging in via a real mobile device,
       * and one for the expo emulator/web. The emulator version is useful for development purposes.
       */
      var isAllowed = await SecureStore.isAvailableAsync();
      if (!isAllowed) {
        const authData = await AsyncStorage.getItem(authName);
        if (authData) {
          /**
           * We've found some auth data, let's send it to our back-end and verify!
           */
          if (authData !== null) {
            const authDataJson = JSON.parse(authData);

            /**
             * Read the data from backend
             */
            fetch(`${backendUrl}/app/verify_authentication`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + authDataJson.token,
              },
              body: JSON.stringify({
                authToken: authDataJson.token,
                username: authDataJson.username,
                deviceId: authDataJson.deviceId,
              }),
              method: "POST",
            })
              .then((res) => res.json())
              .then((data) => {
                if (data) {
                  /**
                   * User is officially logged in!
                   */
                  setMyUserId(data.id);
                  setMyUsername(authDataJson.username);
                  setMyAuthToken(authDataJson.token);

                  /**
                   * Gather the user's settings and then we can start!
                   */
                  fetch(backendUrl + "/settings/user/" + data.id, {
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + authDataJson.token,
                    },
                    method: "GET",
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setMyUserSettings(data);

                      var dataSideColour = data.find(
                        (az) =>
                          az.id > 0 &&
                          az.setting &&
                          az.setting.description === "App Dark Mode"
                      );

                      if (dataSideColour && dataSideColour.rawValue) {
                        setScheme(dataSideColour.rawValue);
                      }

                      setLoggedIn(true);

                      /**
                       * Load user info, such as [bought-premium] etc?
                       */
                      fetch(`${backendUrl}/users/id/${authDataJson.id}`, {
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                          Authorization: "Bearer " + authDataJson.token,
                        },
                        method: "GET",
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          /**
                           * If you don't want the hearts to regenerate a lot, set the last_heart_incremented every time we log in (if we have 5 lives).
                           */
                          /**
                           * Check hearts and regenerate them.
                           */
                          if (myUserId > -1 && data[0].hearts < 5) {
                            /**
                             * Find out how many we need to get to 5.
                             */
                            let missingLives = 5 - data[0].hearts;
                            /**
                             * Maximum of 5, no matter how long it has been since the last regen.
                             */
                            let livesGained = 0;

                            let lastHeartIncrement =
                              data[0].last_heart_increment;

                            if (!lastHeartIncrement) {
                              /**
                               * With no last heart increment, let's fill up all our 5 lives.
                               */
                              livesGained = 5;
                              data[0].hearts = data[0].hearts + missingLives;
                            } else {
                              /**
                               * Count hours since last heart increment
                               */
                              let dateFormat = Date.parse(lastHeartIncrement);

                              const milliseconds = Math.abs(
                                dateFormat - Date.now()
                              );
                              const hours = milliseconds / 36e5;

                              let calculatedHeartsPerHours = hours / 5;

                              if (calculatedHeartsPerHours < 1) {
                                livesGained = 0;
                              } else {
                                livesGained = calculatedHeartsPerHours;
                              }
                            }

                            if (livesGained + data[0].hearts > 5) {
                              livesGained = missingLives;
                            }

                            let resultLives = data[0].hearts + livesGained;

                            /**
                             * Set hide ads to true for user.
                             */
                            fetch(`${backendUrl}/users/edit/${myUserId}`, {
                              method: "PATCH",
                              headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + myAuthToken,
                              },
                              body: JSON.stringify({
                                hearts: Math.floor(resultLives),
                                last_heart_increment: Date.now(),
                              }),
                            })
                              .then((res) => res.json())
                              .then((resultData) => {
                                data[0].hearts = Math.floor(resultLives);
                              })
                              .catch((err) => {
                                console.error(err);
                              });
                          }
                          setMyUserInfo(data[0]);
                        });
                    });
                }
              })
              .catch((e) => {
                console.log(e);
                setLoggedIn(false);
              });
          } else {
            setLoggedIn(false);
          }
        } else {
          setLoadingComplete(true);
          setLoggedIn(false);
        }
      } else {
        try {
          const credentials = await SecureStore.getItemAsync(authName);

          if (credentials) {
            const authDataJson = JSON.parse(credentials);

            let credToken = "";

            if (authDataJson.token && authDataJson.token.length > 0) {
              credToken = authDataJson.token;
            } else if (
              authDataJson.authToken &&
              authDataJson.authToken.length > 0
            ) {
              credToken = authDataJson.authToken;
            }

            /**
             * Read the data from backend
             */
            fetch(`${backendUrl}/app/verify_authentication`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + credToken,
              },
              body: JSON.stringify({
                authToken: credToken,
                username: authDataJson.username,
                deviceId: authDataJson.deviceId,
              }),
              method: "POST",
            })
              .then((response) => response.json())
              .then((data) => {
                if (data) {
                  /**
                   * User is officially logged in!
                   */
                  setMyUserId(data.id);
                  setMyUsername(authDataJson.username);
                  setMyAuthToken(credToken);
                  setLoggedIn(true);

                  /**
                   * Gather the user's settings and then we can start!
                   */
                  fetch(backendUrl + "/settings/user/" + data.id, {
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + credToken,
                    },
                    method: "GET",
                  })
                    .then((res) => res.json())
                    .then((dataSettings) => {
                      if (!dataSettings) {
                        return;
                      }
                      setMyUserSettings(dataSettings);
                      var dataSideColour = dataSettings.find(
                        (az) =>
                          az.id > 0 &&
                          az.setting &&
                          az.setting.description === "App Dark Mode"
                      );

                      if (dataSideColour) {
                        setScheme(dataSideColour.rawValue);
                      }

                      setLoggedIn(true);

                      let userInfoUrl =
                        backendUrl + "/users/id/" + authDataJson.id;

                      /**
                       * Load user info, such as [bought-premium] etc?
                       */
                      fetch(userInfoUrl, {
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                          Authorization: "Bearer " + credToken,
                        },
                        method: "GET",
                      })
                        .then((res) => res.json())
                        .then((dataUserInfo) => {
                          setMyUserInfo(dataUserInfo[0]);
                        });
                    });
                }
              })
              .catch((e) => {
                console.log(e);
                setLoadingComplete(false);
                setLoggedIn(false);
              });

            setLoadingComplete(true);
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    async function loadSettings() {
      fetch(`${backendUrl}/globalsettings/`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + myAuthToken,
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          var arrayToAppend = [];
          if (myUserId > -1) {
            data.forEach((a, b) => {
              var entrance = {
                id: a.id,
                settingId: a.settingId,
                description: a.available_setting
                  ? a.available_setting.description
                  : "Unknown",
                value: a.unconstrainedValue,
              };

              /**
               * This is if we're actually providing banner ads, not if the user is showing/hiding them.
               */
              if (entrance.description === "Show Banner Ads") {
                if (entrance.value === "True") {
                  setShowBannerAds(true);
                } else {
                  setShowBannerAds(false);
                }
              }

              /**
               * Fill up the global settings provider so we can access the data later.
               */
              arrayToAppend.push(entrance);
            });
            setLoadingComplete(true);
            saveGlobalSettingsMany(arrayToAppend);
          }
        })
        .catch((e) => {
          console.log(e);
          setLoadingComplete(true);
        });
    }

    async function loadAvailableSettings() {
      if (!myAuthToken) {
        return;
      }
      fetch(backendUrl + "/settings/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + myAuthToken,
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            var arrayToAppend = [];
            data.forEach((a, b) => {
              var entrance = {
                id: a.id,
                description: a.description ? a.description : "Unknown",
              };

              /**
               * Fill up the global settings provider so we can access the data later.
               */
              arrayToAppend.push(entrance);
            });
            setLoadingComplete(true);
            saveAvailableSettingsMany(arrayToAppend);
          }
        })
        .catch((e) => {
          console.log(e);
          setLoadingComplete(true);
        });
    }

    loadResourcesAndDataAsync();
    setAuthTokenData();
    loadSettings();

    /**
     * Useful for settings that haven't been set yet, e.g. if a new user joins and they
     * don't have anything for [App Dark Mode], the app will know such option exists
     * in the system.
     */
    loadAvailableSettings();

    setLoadingComplete(true);

    // setUpIAP();
  }, [showBannerAds, myUserId, myAuthToken, isLoggedIn]);

  /**
   * Only works on physical devices. No simulators, no web, no emulators.
   */
  async function setUpIAP() {
    try {
      // Set purchase listener
      await InAppPurchases.connectAsync();
      await InAppPurchases.setPurchaseListener(
        ({ responseCode, results, errorCode }) => {
          // Purchase was successful
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            results.forEach((purchase) => {
              if (!purchase.acknowledged) {
                console.log(`Successfully purchased ${purchase.productId}`);

                /**
                 * Set hide ads to true for user.
                 */
                fetch(`${backendUrl}/users/edit/${myUserId}`, {
                  method: "PATCH",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + myAuthToken,
                  },
                  body: JSON.stringify({
                    hide_ads: true,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data) {
                      userDetails.hide_ads = true;
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                  });

                InAppPurchases.finishTransactionAsync(purchase, true);
              }
            });
          }

          if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
            console.log("User canceled the transaction");
          } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
            console.log(
              "User does not have permissions to buy but requested parental approval (iOS only)"
            );
          } else {
            console.warn(
              `Something went wrong with the purchase. Received errorCode ${errorCode}`
            );
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  function setLoggedInSuccessfully() {
    setLoggedIn(true);
  }

  async function handleLogout() {
    try {
      var isMobile = await SecureStore.isAvailableAsync();
      if (!isMobile) {
        AsyncStorage.removeItem("authentication_data");
      } else {
        SecureStore.deleteItemAsync("authentication_data");
      }
    } catch (exception) {
      console.log(exception);
    }
    setLoggedIn(false);
  }

  function awardPoints(gemType, amount) {
    myUserInfo[gemType] += amount;
  }

  function setCategory(id) {
    setMyCategoryId(id);
  }

  const MyTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      backgroundColor: colors.background,
      primary: colors.primary,
    },
  };

  const MyThemeDark = {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      backgroundColor: colors.background,
      primary: colors.primary,
    },
  };

  let theme = isDark ? MyThemeDark : MyTheme;

  if (!isLoadingComplete) {
    return <></>;
  } else {
    return (
      <AuthProvider>
        <AppearanceProvider>
          <ThemeProvider>
            <View style={styles.container}>
              <View style={styles.containerInside}>
                <StatusBar hidden />
                <NavigationContainer
                  theme={theme}
                  ref={containerRef}
                  initialState={initialNavigationState}
                >
                  <Stack.Navigator>
                    <Stack.Screen
                      name="Root"
                      options={{ headerShown: false, tabBarVisible: false }}
                    >
                      {(props) => (
                        <BottomTabNavigator
                          {...props}
                          setLoggedIn={setLoggedInSuccessfully}
                          isLoggedIn={isLoggedIn}
                          setLevel={setMyLevelId}
                          setCategory={setCategory}
                          levelId={myLevelId}
                          categoryId={myCategoryId}
                          username={myUsername}
                          userId={myUserId}
                          myUserSettings={myUserSettings}
                          authToken={myAuthToken}
                          setAuthToken={setMyAuthToken}
                          handleLogout={handleLogout}
                          userDetails={myUserInfo}
                          awardPoints={awardPoints}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen
                      name="ChooseLevel"
                      initialParams={{ id: 1 }}
                      options={{
                        title: "ChooseLevel",
                        headerShown: false,
                        tabBarVisible: false,
                        tabBarIcon: ({ focused }) => (
                          <TabBarIcon
                            focused={focused}
                            name="md-flutter-dash"
                          />
                        ),
                      }}
                    >
                      {(props) => (
                        <CategoryLevelsScreen
                          {...props}
                          authToken={myAuthToken}
                          setLevel={setMyLevelId}
                          username={myUsername}
                          levelId={myLevelId}
                          categoryId={myCategoryId}
                          userId={myUserId}
                          userDetails={myUserInfo}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen
                      name="Question"
                      options={{
                        title: "Question",
                        headerShown: false,
                        tabBarVisible: false,
                        tabBarIcon: ({ focused }) => (
                          <TabBarIcon focused={focused} name="md-settings" />
                        ),
                      }}
                    >
                      {(props) => (
                        <QuestionScreen
                          {...props}
                          username={myUsername}
                          authToken={myAuthToken}
                          levelId={myLevelId}
                          userId={myUserId}
                          setCategory={setCategory}
                          awardPoints={awardPoints}
                          userDetails={myUserInfo}
                          myUserSettings={myUserSettings}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen
                      name="InterstitialAdvertScreen"
                      options={{
                        title: "InterstitialAdvertScreen",
                        headerShown: false,
                        tabBarVisible: false,
                        tabBarIcon: ({ focused }) => (
                          <TabBarIcon focused={focused} name="md-settings" />
                        ),
                      }}
                    >
                      {(props) => <InterstitialAdvertScreen {...props} />}
                    </Stack.Screen>
                  </Stack.Navigator>
                </NavigationContainer>
              </View>
            </View>
          </ThemeProvider>
        </AppearanceProvider>
      </AuthProvider>
    );
  }
}
