import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { MonoText } from "../components/StyledText.js";
import { useTheme } from "../components/ThemeContext.js";
import RedGem from "./TopBarImpl/RedGem.js";
import ClockImage from "./MiscImpl/ClockImage.js";
import TrophyImage from "./MiscImpl/TrophyImage.js";
import StreakImage from "./MiscImpl/StreakImage.js";
import { backendUrl } from "../constants/Environment.js";

export default function AchievementsScreen({ userDetails, authToken }) {
  const [allMyAttempts, setAllMyAttempts] = React.useState([]);
  const [minutesSpent, setMinutesSpent] = React.useState("");
  const [gamesCompleted, setGamesCompleted] = React.useState(0);
  const [totalReferralsMade, setTotalReferralsMade] = React.useState(0);

  const window = useWindowDimensions();
  const { isDark, colors } = useTheme();

  React.useEffect(() => {
    async function loadGlobalSettings() {
      /**
       * Work out the total time spent in the app.
       */
      let url = `${backendUrl}/user/time-spent/${userDetails.id}`;
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
              var totalSeconds = 0;
              var totalWins = 0;
              result.forEach((a, b) => {
                var startDate = a.startDate;
                var endDate = a.endDate;
                var startConvert = new Date(startDate);
                var endConvert = new Date(endDate);

                var completed = a.completed;

                /**
                 * If the user logs out/disconnects, there'll be no endDate, which in turn messes up the calculation. Ignore no endDate ones.
                 */
                if (endDate) {
                  /**
                   * Less than a minute
                   */
                  var seconds = parseInt(
                    ((endConvert - startConvert) / 1000).toFixed(1)
                  );
                  totalSeconds += Math.abs(parseInt(seconds));

                  /**
                   * Append wins/completes. NOTE: This is just completed levels, doesn't mean they got everything correct!
                   */
                  totalWins += completed;
                }
              });
              setGamesCompleted(totalWins);
              setMinutesSpent(String(timeConversion(totalSeconds * 1000)));
              setAllMyAttempts(result);
            });
          })
          .catch((error) => {
            console.log(error);
          });

        if (userDetails.referralCode && userDetails.referralCode.length > 0) {
          url = `${backendUrl}/total-referrals-made/${userDetails.referralCode}`;
          await fetch(url, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + authToken,
            },
            method: "GET",
          }).then((res) => {
            res.json().then((result) => {
              setTotalReferralsMade(parseInt(result.totalReferrals));
            });
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }

    loadGlobalSettings();
  }, [userDetails]);
  function getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }

  function currentConsecutiveDaysPlayed(attempts) {
    let count = 0;

    let arr = [...attempts];

    arr.sort(function (a, b) {
      return new Date(b.startDate) - new Date(a.startDate);
    });

    const uniqueDatesAsArray = [
      ...new Set(arr.map((date) => new Date(date.startDate).toDateString())),
    ].map((string) => new Date(string));

    uniqueDatesAsArray.forEach((o, i) => {
      let el = o;

      let futureOne = i + 1;
      if (futureOne <= uniqueDatesAsArray.length) {
        let futureDate = uniqueDatesAsArray[futureOne];

        let dateA = new Date(el);
        let dateB = new Date(futureDate);

        if (getDifferenceInDays(dateA, dateB) <= 1) {
          count++;
        }
      }
    });
    return count;
  }

  function timeConversion(millisec) {
    var seconds = (millisec / 1000).toFixed(1);
    var minutes = (millisec / (1000 * 60)).toFixed(1);
    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) {
      return seconds + " Sec";
    } else if (minutes < 60) {
      return minutes + " Min";
    } else if (hours < 24) {
      return hours + " Hrs";
    } else {
      return days + " Days";
    }
  }

  function getJoinedString(date) {
    var strDate = date;
    var strSplitDate = String(strDate).split(" ");
    var date = new Date(strSplitDate[0]);
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var resultMonth = date.getMonth();
    var resultYear = date.getFullYear();
    return "Joined " + monthNames[resultMonth] + " " + resultYear;
  }

  if (!userDetails) {
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
            style={{
              flex: 1,
              fontSize: 100,
              backgroundColor: colors.background,
              color: colors.background,
            }}
          >
            <View
              style={{
                flex: 1,
                marginTop: 20,
                marginBottom: window.width > 900 ? 48 : 20,
              }}
            >
              <MonoText
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 24,
                  paddingTop: 12,
                  color: "#ffea00",
                  fontWeight: "bold",
                }}
              >
                Profile information
              </MonoText>
            </View>
            <View
              style={{
                flex: 3,
                borderColor: isDark ? "#2b2b2b" : "#ffea00",
                borderTopWidth: 2,
                borderBottomWidth: 2,
              }}
            >
              <View
                style={{
                  paddingLeft: 24,
                  paddingRight: 24,
                  marginTop: 12,
                  marginBottom: 24,
                }}
              >
                <MonoText
                  style={{
                    color: colors.text,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  {userDetails.name}
                </MonoText>
                <MonoText
                  style={{
                    color: colors.text,
                    paddingBottom: 6,
                    fontSize: 16,
                  }}
                >
                  {userDetails.email}
                </MonoText>
                <MonoText
                  style={{
                    color: colors.text,
                    fontSize: 16,
                  }}
                >
                  {getJoinedString(userDetails.createdAt)}
                </MonoText>
                <MonoText
                  style={{
                    color: colors.text,
                    fontSize: 16,
                  }}
                >
                  Referrals made {totalReferralsMade}
                </MonoText>
              </View>
            </View>
            <View
              style={{ flex: 5, marginBottom: 48}}
            >
              <View
                style={{
                  paddingLeft: 24,
                  paddingRight: 24,
                  marginTop: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MonoText
                  style={{
                    color: colors.text,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  Points
                </MonoText>
                <FlatList
                  style={{ marginTop: 12}}
                  data={[
                    {
                      component: (
                        <RedGem
                          locked={userDetails.red_gems < 1 ? true : false}
                        />
                      ),
                      itemScore: userDetails.red_gems,
                      description: "Total gems",
                    },
                    {
                      component: <ClockImage />,
                      itemScore: minutesSpent,
                      description: "Time spent",
                    },
                    {
                      component: <TrophyImage />,
                      itemScore: gamesCompleted,
                      description: "Total Games",
                    },
                    {
                      component: <StreakImage />,
                      itemScore:
                        currentConsecutiveDaysPlayed(allMyAttempts) + " Days",
                      description: "Consecutive",
                    },
                  ]}
                  numColumns={2}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        flex: 1,
                        borderColor: "#b8b8b8",
                        height: 60,
                        borderWidth: 2,
                        margin: 4,
                        marginTop: 8,
                        borderRadius: 14,
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
                            maxWidth: 48,
                            left: 16,
                            top: 24,
                          }}
                        >
                          {item.component}
                        </View>
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flex: 1,
                              paddingTop: 4,
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
                              {item.itemScore}
                            </MonoText>
                          </View>
                          <View style={{ flex: 1 }}>
                            <MonoText
                              style={{
                                color: colors.text,
                              }}
                            >
                              {item.description ? item.description : index}
                            </MonoText>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
            <View
              style={{
                flex: 4,
                borderColor: isDark ? "#2b2b2b" : "#ededed",
                borderTopWidth: 2,
              }}
            >
              <View
                style={{
                  paddingLeft: 24,
                  paddingRight: 24,
                  marginTop: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MonoText
                  style={{
                    color: colors.text,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  Refer Friends
                </MonoText>
                <MonoText
                  style={{
                    color: colors.text,
                    marginTop: 12,
                  }}
                >
                  Send the following code below to your friends and win prizes!
                </MonoText>
                <View
                  style={[
                    {
                      backgroundColor: "rgba(0,0,0,0.05)",
                      borderRadius: 3,
                      paddingHorizontal: 4,
                    },
                    {
                      marginVertical: 7,
                    },
                  ]}
                >
                  <MonoText
                    style={{
                      color: colors.text,
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      fontSize: 24,
                    }}
                  >
                    {userDetails.referralCode
                      ? userDetails.referralCode
                      : "Missing code."}
                  </MonoText>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
