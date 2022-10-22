import * as React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useContext } from "react";
import { useTheme } from "../components/ThemeContext.js";
import { GlobalSettingsContext } from "../context/GlobalSettingsProvider.js";
import { AvailableUserSettingsContext } from "../context/AvailableUserSettingsProvider.js";
import { MonoText } from "../components/StyledText.js";
import RedGem from "./TopBarImpl/RedGem.js";
import { MarketplaceItemsContext } from "../constants/MarketplaceItems.js";
import { buyItem } from "../context/BuyMarketplaceItem.js";

export default function MarketplaceScreen({
  authToken,
  myUserSettings,
  userDetails,
}) {
  const { colors } = useTheme();
  const { globalSettings } = useContext(GlobalSettingsContext);
  const { availableSettings } = useContext(AvailableUserSettingsContext);

  const { itemsForSale, setItemsForSale } = useContext(MarketplaceItemsContext);

  const technoSoundpackValue = () => {
    if (myUserSettings) {
      var result = myUserSettings.find(
        (a) => a.setting && a.setting.description === "Techno Soundpack"
      );
      if (!result) {
        return false;
      }
      return result.rawValue === "true";
    }
    return false;
  };

  const unlimitedLivesOneDayValue = () => {
    if (myUserSettings) {
      var result = myUserSettings.find(
        (a) => a.setting && a.setting.description === "Unlimited Lives"
      );
      if (!result) {
        return false;
      }
      return result.rawValue;
    }
    return false;
  };

  /**
   * Load the global settings that we need prior to rendering the screen.
   */
  React.useEffect(() => {
    async function loadGlobalSettings() {
      let techno = technoSoundpackValue();
      if (techno) {
        var cloned = [...itemsForSale];
        cloned.find((a) => a.item === "Techno Soundpack").owned = true;
        setItemsForSale(cloned);
      }

      /**
       * Check for unlimited lives power-up
       */
      let unlimitedLivesDay = unlimitedLivesOneDayValue();
      if (unlimitedLivesDay) {
        let lastPowerup = new Date(unlimitedLivesDay);

        var diff = (new Date().getTime() - lastPowerup.getTime()) / 1000;
        diff /= 60;

        var isSameDay = diff <= 1440;

        /**
         * Measure the date since last power up and see if still active.
         */
        if (isSameDay) {
          var cloned = [...itemsForSale];
          cloned.find((a) => a.item === "Unlimited Lives").owned = true;
          setItemsForSale(cloned);
        }
      }

      /**
       * Lock unaffordable ones
       */
      var cloned = [...itemsForSale];
      cloned.forEach((a, b) => {
        if (a.currency === "red_gems") {
          let myGems = userDetails.red_gems;
          if (a.cost > myGems) {
            a.locked = true;
          }
        }
      });
      setItemsForSale(cloned);
    }
    loadGlobalSettings();
  }, [myUserSettings, globalSettings, availableSettings, userDetails]);

  if (!availableSettings) {
    return <></>;
  }

  function renderItemCostAndCurrency(item) {
    let ranking = item.currency;
    if (ranking === "red_gems") {
      /**
       * Red gems
       */
      return (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              flex: 2,
              width: 24,
              height: 24,
            }}
          >
            <RedGem inline />
          </View>
          <View
            style={{
              flex: 8,
              flexDirection: "row",
              marginTop: -3,
            }}
          >
            <MonoText
              style={{ fontWeight: "bold", color: "#fc000a", width: 128 }}
            >
              {item.owned ? "Already owned" : item.cost}
            </MonoText>
          </View>
        </View>
      );
    } else if (ranking === "USD") {
      /**
       * Real-life currency
       */
      return (
        <View>
          <MonoText style={{ color: colors.text }}>{"$" + item.cost}</MonoText>
        </View>
      );
    }
    return ranking;
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
      alignItems: "center",
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
          <View style={styleDynamic.container}>
            <View
              style={{
                backgroundColor: colors.background,
                flex: 1,
              }}
            >
              <View
                style={{
                  paddingLeft: 24,
                  paddingRight: 24,
                  marginTop: 24,
                  backgroundColor: colors.background,
                }}
              >
                <MonoText
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: colors.text,
                  }}
                >
                  Subjects
                </MonoText>
                <FlatList
                  style={{ marginTop: 12 }}
                  data={itemsForSale}
                  numColumns={1}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      activeOpacity={item.locked ? 1 : 0.7}
                      onPress={(e) =>
                        !item.locked &&
                        !item.owned &&
                        buyItem(userDetails, myUserSettings, authToken, item)
                      }
                    >
                      <View
                        style={{
                          borderColor: "grey",
                          height: 120,
                          borderWidth: 1,
                          margin: 4,
                          marginTop: 8,
                          borderRadius: 12,
                          minWidth: 350,
                          backgroundColor: !item.locked ? colors.background : 'rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              padding: 20,
                              maxWidth: 108,
                            }}
                          >
                            {item.component}
                          </View>
                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                flex: 2,
                                paddingTop: 4,
                                paddingLeft: 18,
                              }}
                            >
                              <MonoText
                                style={{
                                  fontSize: 18,
                                  paddingTop: 4,
                                  fontWeight: "bold",
                                  color: colors.text,
                                }}
                              >
                                {item.item}
                              </MonoText>
                            </View>
                            <View
                              style={{
                                flex: 4,
                                paddingTop: 12,
                                paddingLeft: 18,
                              }}
                            >
                              <MonoText
                                style={{
                                  color: colors.text,
                                }}
                              >
                                {item.description ? item.description : index}
                              </MonoText>
                            </View>
                            <View
                              style={{
                                flex: 2,
                                paddingLeft: 18,
                              }}
                            >
                              <MonoText>
                                {renderItemCostAndCurrency(item)}
                              </MonoText>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
