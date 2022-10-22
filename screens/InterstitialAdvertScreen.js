import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { AdMobInterstitial } from "expo-ads-admob";

import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { GlobalSettingsContext } from "../context/GlobalSettingsProvider.js";

export default function InterstitialAdvertScreen({ navigation }) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  /**
   * Keep advert provider for future-proofing. We'll be adding Facebook and other advert providers.
   */
  const [advertProvider, setAdvertProvider] = React.useState("");
  const [advertId, setAdvertId] = React.useState("");

  const { globalSettings } = React.useContext(GlobalSettingsContext);

  React.useEffect(() => {
    async function loadGlobalSettings() {
      var settingDescription = "Interstitial Provider".toLowerCase();
      var settingsInterstitialProvider = globalSettings.find(
        (a) =>
          a.description &&
          a.description.toLowerCase().includes(settingDescription)
      );
      if (settingsInterstitialProvider && settingsInterstitialProvider.value) {
        setAdvertProvider(settingsInterstitialProvider.value);
      }

      /**
       * Load the interstitial advert id
       */
      var advertIdDescription = "Interstitial ID";
      var advertIdResult = globalSettings.find(
        (a) => a.description && a.description.includes(advertIdDescription)
      );
      if (advertIdResult && advertIdResult.value) {
        setAdvertId(advertIdResult.value);
      }
    }

    async function handleAd() {
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

    loadGlobalSettings();
    handleAd();
  }, [globalSettings, advertId]);

  function pressFunction() {
    /**
     * If question id is <0, then redirect to category select
     */

    navigation.navigate("Question");
  }

  if (advertId.length < 1) {
    return <></>;
  }

  if (!isLoadingComplete) {
    /**
     * On web we can't show ads yet - only mobile gets them!
     */
    return (
      <View style={{ flex: 1, backgroundColor: "yellow" }}>
        <View style={styles.progressBarPlaceholder}>
          <View style={styles.progressBarPlaceholderNorth}>
            <View style={styles.progressBarCollection}>
              <TouchableOpacity onPress={pressFunction}>
                <Ionicons
                  name={"md-close"}
                  size={32}
                  color="rgba(0,0,0,0.35)"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  return <></>;
}

const styles = StyleSheet.create({
  progressBarPlaceholder: {
    zIndex: 210,
    position: "relative",
    top: "2.5%",
  },
  progressBarPlaceholderNorth: {
    flex: 0,
    height: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarCollection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: 24,
  },
});
