import * as React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

import PropTypes from "prop-types";
import { MonoText } from "../components/StyledText";
import LevelGrid from "../components/LevelGrid.js";
import { useTheme } from "../components/ThemeContext.js";
import { Ionicons } from "@expo/vector-icons";
import { backendUrl } from "../constants/Environment.js";
import { GlobalSettingsContext } from "../context/GlobalSettingsProvider.js";

export default function CategoryLevelsScreen({
  navigation,
  route,
  username,
  categoryId,
  setLevel,
  authToken,
  userId,
  userDetails,
}) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  const [levels, setLevels] = React.useState([]);
  const [fullQuestions, setFullQuestions] = React.useState([]);

  const [progress, setProgress] = React.useState([]);

  const { colors } = useTheme();

  var height = Dimensions.get("window").height;

  const [allowShowInterstitialAdvert, setAllowShowInterstitialAdvert] =
    React.useState(false);

  const { globalSettings } = React.useContext(GlobalSettingsContext);

  React.useEffect(() => {
    async function loadGlobalSettings() {
      var settingShowInterstitialAds = globalSettings.find(
        (a) =>
          a.description && a.description.toLowerCase().includes("show end ads")
      );
      if (settingShowInterstitialAds) {
        if (settingShowInterstitialAds.value.toLowerCase() === "true") {
          setAllowShowInterstitialAdvert(true);
        } else {
          setAllowShowInterstitialAdvert(false);
        }
      }
    }

    loadGlobalSettings();
  }, [globalSettings]);

  async function selectLevel(sel) {
    var result = levels.find((a) => a.id === parseInt(sel));

    setLevel(result.id);

    if (allowShowInterstitialAdvert) {
      /**
       * Show both and then do goBack()
       */
      navigation.navigate("Question", { chosenLevel: result.name });
      navigation.navigate("InterstitialAdvertScreen");
    } else {
      navigation.navigate("Question", { chosenLevel: result.name });
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      /**
       * User's progress so we can lock/unlock levels
       */
      await fetch(backendUrl + "/levelprogress/me/" + userId, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authToken,
        },
      }).then(function (response) {
        if (response.status !== 200) {
          console.log("Error fetching level progress for user id " + userId);
          return;
        }
        response.json().then(function (data) {
          setProgress(data);
        });
      });
    });

    return unsubscribe;
    /**
     * Progress fluctuates often so we need to re-render the page if the user's progress changes (to unlock more levels etc.)
     *
     * Once navigation changes, re-load the progress and trigger re-render. Hence [navigation] below.
     */
  }, [navigation]);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        /*
         * Load the category's list of levels
         */
        await fetch(backendUrl + "/levels/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        }).then(function (response) {
          if (response.status !== 200) {
            console.log("Problem in fetching levels");
            return;
          }
          response.json().then(function (data) {
            setLevels(data);
          });
        });

        /*
         * Load the category's list of levels
         */
        await fetch(backendUrl + "/view/full-questions/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authToken,
          },
        }).then(function (response) {
          if (response.status !== 200) {
            console.log("Problem in fetching full-questions.");
            return;
          }
          response.json().then(function (data) {
            setFullQuestions(data);
          });
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }
    loadResourcesAndDataAsync();
  }, [isLoadingComplete]);

  const goBackToCategorySelectScreen = () => {
    navigation.navigate("ChooseCategory");
  };

  function getLevelsAsItems() {
    if (fullQuestions && categoryId > 0) {
      var result = fullQuestions.find(
        (a) => a.id > 0 && parseInt(a.id) === parseInt(categoryId)
      );
      if (!result || result.length < 1) {
        return [];
      }
      var sorted = result.levels.sort(
        (a, b) => parseInt(a.level) - parseInt(b.level)
      );
      return sorted;
    }
    return [];
  }

  if (!levels) {
    return null;
  }

  var styleDynamic = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    textStyle: {
      fontSize: 18,
      paddingLeft: 6,
      fontWeight: "bold",
      color: colors.text,
    },
    vectorStyle: {
      color: colors.vectorColor,
    },
  });

  return (
    <View style={styleDynamic.container} activeOpacity={1}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 2,
            paddingLeft: "2%",
            paddingTop: "2%",
            width: 50,
            height: 50,
          }}
        >
          <TouchableOpacity onPress={goBackToCategorySelectScreen}>
            <Ionicons
              name="md-arrow-back"
              size={32}
              color={colors.vectorColor}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 4,
            alignItems: "center",
            paddingTop: "3.7%",
            width: 50,
            height: 50,
          }}
        >
          <MonoText style={styleDynamic.textStyle}>
            {route.params.chosenCategory}
          </MonoText>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row-reverse",
            paddingRight: "2%",
            paddingTop: "1.2%",
            width: 50,
            height: 50,
          }}
        ></View>
      </View>
      <View style={{ flexDirection: "column", height: height }}>
        <View
          style={{ flex: 3, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              backgroundColor: "white",
              height: 156,
              width: 156,
              marginLeft: 25,
              marginRight: 25,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              justifyContent: "center",
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 6,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 24,
              maxHeight: 300,
              overflow: "hidden",
              marginTop: 48,
            }}
          >
            <Image
              style={{ height: "100%", width: "100%", alignItems: "center" }}
              source={{
                uri:
                  backendUrl +
                  "/categories/view-image/" +
                  categoryId.toString(),
              }}
            ></Image>
          </View>
          <MonoText
            style={{
              marginTop: 18,
              color: colors.text,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Select any level below to start playing.
          </MonoText>

          <View style={{ flex: 7, minHeight: 400 }}>
            <LevelGrid
              items={getLevelsAsItems()}
              selectLevel={selectLevel}
              progress={progress}
              hearts={userDetails.hearts}
            ></LevelGrid>
          </View>
        </View>
      </View>
    </View>
  );
}

CategoryLevelsScreen.navigationOptions = {
  header: null,
};

CategoryLevelsScreen.propTypes = {
  text: PropTypes.string,
};
