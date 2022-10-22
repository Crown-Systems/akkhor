import * as React from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useContext } from "react";
import { useTheme } from "../components/ThemeContext.js";
import { GlobalSettingsContext } from "../context/GlobalSettingsProvider.js";
import { AvailableUserSettingsContext } from "../context/AvailableUserSettingsProvider.js";
import { backendUrl } from "../constants/Environment.js";
import { MonoText } from "../components/StyledText.js";
import GoldMedal from "./MiscImpl/GoldMedal.js";
import LeaderboardBanner from "./MiscImpl/LeaderboardBanner.js";

export default function LeaderboardScreen({
  authToken,
  myUserSettings,
  userDetails,
}) {
  const { colors } = useTheme();
  const { globalSettings } = useContext(GlobalSettingsContext);
  const { availableSettings } = useContext(AvailableUserSettingsContext);

  const [leaderboardMembers, setLeaderboardMembers] = React.useState([]);

  function getCompletedLevelsForUserId(data, id) {
    if (!data) {
      /**
       * Missing user list.
       */
      return -1;
    }

    /**
     * Get user object
     */
    let resultUser = data.find((a) => a.id === id);
    if (!resultUser) {
      /**
       * No user found with given id.
       */
      return -2;
    }

    /**
     * Get number of levels completed by user
     *
     * NOTE: The association is called 'users' in the database, don't be confused!
     */
    let levelAttempts = resultUser.users;
    if (!levelAttempts) {
      return 0;
    }
    return levelAttempts.filter((a) => a.completed).length;
  }

  /**
   * Load the global settings that we need prior to rendering the screen.
   */
  React.useEffect(() => {
    async function loadGlobalSettings() {
      /**
       * Get a list of top 15 players for the leaderboard
       */
      /**
       * Set the dark mode button here
       */

      let url = `${backendUrl}/view/user-attempt-statistics/`;
      try {
        await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          method: "GET",
        })
          .then((res) => {
            res.json().then((result) => {
              let dataUsers = [...result];
              dataUsers = dataUsers.sort(
                (a, b) =>
                  getCompletedLevelsForUserId(dataUsers, b.id) -
                  getCompletedLevelsForUserId(dataUsers, a.id)
              );
              dataUsers.forEach((a) => {
                a.levelsCompleted = a.users
                  ? a.users.filter((a) => a.completed).length
                  : 0;
              });
              setLeaderboardMembers(dataUsers);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        console.warn(e);
      }
    }
    loadGlobalSettings();
  }, [myUserSettings, globalSettings, availableSettings]);

  if (!availableSettings) {
    return <></>;
  }

  function renderComponentForRanking(ranking) {
    if (ranking === 1) {
      /**
       * Gold
       */
      return <GoldMedal />;
    } else if (ranking === 2) {
      /**
       * Silver
       */
      return <GoldMedal medal={"silver"} />;
    } else if (ranking === 3) {
      /**
       * Bronze
       */
      return <GoldMedal medal={"bronze"} />;
    }
    return ranking;
  }

  if (!leaderboardMembers) {
    return <></>;
  }

  var styleDynamic = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      textShadowColor: "#585858",
      textShadowOffset: { width: 5, height: 5 },
      textShadowRadius: 10,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 0,
    },
    nextContainer: {
      marginBottom: 32,
      marginTop: 0,
      alignItems: "center",
      backgroundColor: colors.background,
      flex: 1,
      paddingTop: 30,
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
          <View
            style={{
              backgroundColor: colors.background,
            }}
          ></View> 
          <View style={{ flex: 1 }}>
            <View >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 32,
                }}
              >
                <LeaderboardBanner />
                <MonoText
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginTop: 24,
                    color: colors.text,
                  }}
                >
                  Leaderboards
                </MonoText>
              </View>
            </View>
            <View style={{ flex: 6 }}>
              <ScrollView
                style={{
                  paddingLeft: 24,
                  paddingRight: 24,
                }}
              >
                <FlatList
                  style={{ marginTop: 2 }}
                  data={leaderboardMembers}
                  numColumns={1}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        borderColor:
                          item.name === userDetails.name ? "green" : "grey",
                        height: 60,
                        borderWidth: 1,
                        margin: 4,
                        borderRadius: 12,
                        minWidth: 350,
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
                            maxWidth: 56,
                          }}
                        >
                          <MonoText
                            style={{
                              padding: index + 1 <= 3 ? 12 : 20,
                              maxWidth: 56,
                              color:
                                item.name === userDetails.name
                                  ? "green"
                                  : colors.text,
                            }}
                          >
                            {renderComponentForRanking(index + 1)}
                          </MonoText>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flex: 1,
                              paddingTop: 4,
                              left: 0,
                            }}
                          >
                            <MonoText
                              style={{
                                fontSize: 18,
                                paddingTop: 4,
                                fontWeight: "bold",
                                color:
                                  item.name === userDetails.name
                                    ? "green"
                                    : colors.text,
                              }}
                            >
                              {item.name === userDetails.name
                                ? item.name + " (me)"
                                : item.name}
                            </MonoText>
                          </View>
                          <View style={{ flex: 1 }}>
                            <MonoText
                              style={{
                                color:
                                  item.name === userDetails.name
                                    ? "green"
                                    : colors.text,
                              }}
                            >
                              {item.levelsCompleted} total wins
                            </MonoText>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
