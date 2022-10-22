import * as React from "react";
import { StyleSheet, View, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { ScrollView } from "react-native-gesture-handler";
import { useContext } from "react";

import { useTheme } from "../components/ThemeContext.js";

import SettingToggle from "./SettingsImpl/SettingToggle.js";

import { GlobalSettingsContext } from "../context/GlobalSettingsProvider.js";

import { AvailableUserSettingsContext } from "../context/AvailableUserSettingsProvider.js";

import { backendUrl } from "../constants/Environment.js";

import { MonoText } from "../components/StyledText.js";
import { useWindowDimensions } from "react-native";

export default function SettingsScreen({
  navigation,
  route,
  handleLogout,
  userId,
  authToken,
  myUserSettings,
}) {
  const { colors, isDark, setScheme } = useTheme();
  const { globalSettings } = useContext(GlobalSettingsContext);
  const { availableSettings } = useContext(AvailableUserSettingsContext);

  const [toggleMuteSounds, setToggleMuteSounds] = React.useState(false);
  const [toggleDarkMode, setToggleDarkMode] = React.useState(false);

  const darkThemeDescription = "App Dark Mode";
  const muteSoundsDescription = "Mute Sounds";

  const window = useWindowDimensions();

  const container = {
    flex: 1,
    backgroundColor: colors.background,
  };

  const contentContainer = {
    paddingTop: 15,
  };

  const darkModeLabel = () => {
    if (!availableSettings) {
      return "Loading...";
    }
    var result = availableSettings.find(
      (a) => a && a.description && a.description === darkThemeDescription
    );
    if (!result) {
      /**
       * If no setting is found, resort to the globalsettings thing
       */
      return "App Dark Mode";
    }
    return result.description;
  };

  const muteSoundsLabel = () => {
    if (!availableSettings) {
      return "Loading...";
    }
    var result = availableSettings.find(
      (a) => a && a.description && a.description === muteSoundsDescription
    );
    if (!result) {
      /**
       * If no setting is found, resort to the globalsettings thing
       */
      return "Mute Sounds";
    }
    return result.description;
  };

  const darkModeValue = () => {
    if (myUserSettings) {
      var result = myUserSettings.find(
        (a) => a.setting && a.setting.description === darkThemeDescription
      );
      if (!result) {
        return false;
      }
      return result.rawValue === "dark";
    }
    return false;
  };

  const muteSoundsValue = () => {
    if (myUserSettings) {
      var result = myUserSettings.find(
        (a) => a.setting && a.setting.description === muteSoundsDescription
      );
      if (!result) {
        return false;
      }
      return result.rawValue === "true";
    }
    return false;
  };

  const communityLinkValue = () => {
    if (globalSettings) {
      var result = globalSettings.find(
        (a) => a.description === "Community Link"
      );
      if (!result) {
        return false;
      }
      return result.value;
    }
    return "";
  };

  const toggleScheme = () => {
    /*
     * setScheme will change the state of the context
     * thus will cause childrens inside the context provider to re-render
     * with the new color scheme
     */
    var next = isDark ? "light" : "dark";
    setScheme(next);
    setToggleDarkMode(next === "dark");

    /**
     * Update the backend for the setting chosen by the user.
     */
    fetch(`${backendUrl}/user-settings/edit/${userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({
        userId: userId,
        settingDescription: darkThemeDescription,
        value: next,
      }),
    })
      .then((response) => {
        if (response) {
          response.json().then((response) => {});
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const toggleMute = () => {
    var next = true;

    var val = muteSoundsValue();
    if (val === false) {
      next = true;
    } else {
      next = false;
    }

    setToggleMuteSounds(next);

    /**
     * Update the backend for the setting chosen by the user.
     */
    fetch(`${backendUrl}/user-settings/edit/${userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({
        userId: userId,
        settingDescription: muteSoundsDescription,
        value: next,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          var result = myUserSettings.find(
            (a) => a.setting && a.setting.description === muteSoundsDescription
          );
          if (!result) {
            /**
             * Add a local value
             */
            myUserSettings.push({
              rawValue: next.toString(),
              userId: userId,
              setting: {
                description: muteSoundsDescription,
              },
            });
            return false;
          } else {
            result.rawValue = next.toString();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    setToggleMuteSounds(muteSoundsValue());
    setToggleDarkMode(darkModeValue());
  }, []);

  if (!availableSettings) {
    return <></>;
  }

  var styleDynamic = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      textShadowColor: "#585858",
      textShadowOffset: { width: 5, height: 5 },
      textShadowRadius: 10,
    },
    nextContainer: {
      marginBottom: 32,
      marginTop: 0,
      alignItems: window.width > 800 ? "center" : "stretch",
      minHeight: 600,
      backgroundColor: colors.background,
      flex: 1,
      paddingTop: 30,
      flexGrow: 1,
    },
  });

  return (
    <ScrollView
      style={{
        backgroundColor: colors.background,
      }}
    >
      <TouchableOpacity style={styleDynamic.container} activeOpacity={1}>
        <View style={styleDynamic.nextContainer}>
          <ScrollView
            style={container}
            contentContainerStyle={contentContainer}
          >
            <OptionButton
              icon="school-outline"
              label="Ask a question on the forums"
              onPress={() =>
                WebBrowser.openBrowserAsync(String(communityLinkValue))
              }
            />
            <OptionButton
              description={darkThemeDescription}
              icon="contrast-outline"
              label={darkModeLabel()}
              isToggle={true}
              action={toggleScheme}
              value={toggleDarkMode}
            ></OptionButton>
            <OptionButton
              description={muteSoundsDescription}
              icon="volume-mute-outline"
              label={muteSoundsLabel()}
              isToggle={true}
              action={toggleMute}
              value={toggleMuteSounds}
            ></OptionButton>
            <OptionButton
              icon="document-text-outline"
              label="Privacy Policy"
              onPress={() =>
                WebBrowser.openBrowserAsync("yourprivacypolicylink.com")
              }
            />
            <OptionButton
              icon="exit-outline"
              label="Sign out"
              onPress={() => {
                handleLogout(false);
              }}
              action={() => {}}
              isLastOption
            />
          </ScrollView>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

function OptionButton({
  icon,
  label,
  onPress,
  isLastOption,
  isToggle,
  action,
  value,
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    optionIconContainer: {
      marginRight: 12,
    },
    option: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: 0,
      borderColor: colors.secondaryBorderColour,
    },
    lastOption: {
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: {
      fontSize: 15,
      alignSelf: "flex-start",
      marginTop: 1,
      color: colors.text,
    },
  });

  if (isToggle) {
    return (
      <TouchableOpacity
        style={[styles.option, isLastOption && styles.lastOption]}
        onPress={(a) => action()}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={styles.optionIconContainer}>
            <Ionicons name={icon} size={22} color={colors.vectorColor} />
          </View>
          <View style={styles.optionTextContainer}>
            <MonoText style={styles.optionText}>{label}</MonoText>
          </View>
          {isToggle && (
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignSelf: "flex-end",
              }}
            >
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => action()}
                value={value}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color={colors.vectorColor} />
        </View>
        <View style={styles.optionTextContainer}>
          <MonoText style={styles.optionText}>{label}</MonoText>
        </View>
        {isToggle && (
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignSelf: "flex-end",
            }}
          >
            <SettingToggle />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
