import * as React from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";

import PropTypes from "prop-types";
import CategoryGrid from "../components/CategoryGrid.js";
import ScoreBar from "./TopBarImpl/ScoreBar.js";
import BottomBannerAd from "./MiscImpl/BottomBannerAd.js";
import { useTheme } from "../components/ThemeContext.js";
import { backendUrl } from "../constants/Environment.js";
import * as SecureStore from "expo-secure-store";
import { GlobalSettingsContext } from "../context/GlobalSettingsProvider.js";

export default function CategorySelectScreen({
  navigation,
  setCategory,
  authToken,
  userDetails,
}) {
  const { globalSettings } = React.useContext(GlobalSettingsContext);
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);
  const { isDark, colors } = useTheme();

  const [isShowBannerAd, setShowBannerAd] = React.useState(false);
  const [bannerAdvertId, setBannerAdvertId] = React.useState("");

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        /*
         * Load the category list
         */
        await fetch(backendUrl + "/categories/", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          method: "GET",
        }).then(async function (response) {
          if (response.status !== 200) {
            console.log("Problem in fetching categories.");
            return;
          }
          response.json().then(function (data) {
            setCategoryList(data);
          });
        });
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    async function handleAd() {
      var settingDescription = "Show Banner Ads";
      var settingsShowBannerAds = globalSettings.find(
        (a) => a.description && a.description.includes(settingDescription)
      );
      if (
        settingsShowBannerAds &&
        settingsShowBannerAds.value &&
        settingsShowBannerAds.value.toLowerCase() === "true"
      ) {
        setShowBannerAd(true);

        /**
         * Get the banner ID
         */
        var bannerAdIdSettingDescription = "Banner ID";
        var bannerAdIdSettingResult = globalSettings.find(
          (a) =>
            a.description &&
            a.description.includes(bannerAdIdSettingDescription)
        );
        if (bannerAdIdSettingResult && bannerAdIdSettingResult.value) {
          setBannerAdvertId(bannerAdIdSettingResult.value);
        }
      }

      var isMobile = await SecureStore.isAvailableAsync();
      if (!isMobile) {
        /**
         * On web we can't show ads yet - only mobile gets them!
         */
        setLoadingComplete(false);
        return;
      } else {
        setLoadingComplete(true);

        /**
         * Read the Advert Provider from the back-end (either Admob or FB ads)
         */
        await AdMobInterstitial.setAdUnitID(advertId);
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });

        /**
         * Apparently only this one works for interstitials...
         */
        AdMobInterstitial.addEventListener("interstitialDidClose", () => {
          navigation.goBack();
        });
        await AdMobInterstitial.addEventListener("adClosed", () => {
          navigation.goBack();
        });
        await AdMobInterstitial.showAdAsync();
      }
    }

    loadResourcesAndDataAsync();
    // handleAd();
  }, [authToken, userDetails]);

  function handleSelectCategory(sel) {
    var result = categoryList.find((a) => a.id === parseInt(sel));
    setCategory(result.id);
    navigation.navigate("ChooseLevel", { chosenCategory: result.name });
  }

  var styleDynamic = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      ///*  textShadowColor: "#585858",
      // textShadowOffset: { width: 5, height: 5 },
      // textShadowRadius: 10, */
    },
  });

  if (!isLoadingComplete && categoryList.length < 1) {
    return null;
  }

  if (!userDetails) {
    /**
     * Don't render until we get some user details in place, supplied by the main entrypoint (App.js).
     */
    return null;
  }

  /**
   * This design type has the vertical list of categories with a few lines of descriptions and widgets.
   */
  return (
    <React.Fragment>
      <View
        elevation={5}
        style={{
          backgroundColor: colors.background,
          height: 60,
          borderBottomWidth: 2,
          borderBottomColor: isDark ? "#2b2b2b" : "#ededed",
          marginTop: -2,
          paddingTop: 14,
        }}
      >
        {userDetails && (
          <ScoreBar
            red_gems={userDetails.red_gems}
            yellow_gems={userDetails.yellow_gems}
            blue_gems={userDetails.blue_gems}
            hearts={userDetails.hearts}
          />
        )}
      </View>

      <ScrollView>
        <TouchableOpacity style={styleDynamic.container} activeOpacity={1}>
          <View style={styles.welcomeContainer}></View>

          <View style={styleDynamic.container}>
            <CategoryGrid
              items={categoryList}
              selectFunction={handleSelectCategory}
            ></CategoryGrid>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {isShowBannerAd && bannerAdvertId && (
        <View
          style={{
            backgroundColor: colors.background,
            height: 60,
            borderBottomWidth: 1,
            borderBottomColor: "grey",
            marginTop: -2,
            paddingTop: 14,
          }}
        >
          <BottomBannerAd advertId={bannerAdvertId}></BottomBannerAd>
        </View>
      )}
    </React.Fragment>
  );
}

CategorySelectScreen.navigationOptions = {
  header: null,
};

CategorySelectScreen.propTypes = {
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0,
  },
});
