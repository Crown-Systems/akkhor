import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../components/ThemeContext.js";

const styles = (isDark, showNoLives) =>
  StyleSheet.create({
    progressBarPlaceholder: {
      zIndex: 210,
      position: "relative",
      top: "2.5%", 
      paddingBottom: 32,
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
      marginRight: 8,
    },
    progressBarEmpty: {
      flex: 1,
      borderRadius: 98,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      height: 16,
      width: 250,
      backgroundColor: showNoLives
        ? "rgba(0,0,0,0.3)"
        : isDark
        ? "#1c1c1c"
        : "#b0b0b0",
    },
  });

function getProgressForPoints(points, questionsSeen, totalQuestionSize) {
  return {
    borderRadius: 98,
    backgroundColor: "#055169",
    height: 16,
    opacity: 1,
    width: points > 0 ? (questionsSeen / totalQuestionSize) * 100 + "%" : 0,
  };
}

export default function QuestionProgressBar({
  pressFunction,
  points,
  questionsSeen,
  totalQuestionSize,
  showNoLives,
}) {
  const { isDark, colors } = useTheme();
  const stylesObject = styles(isDark, colors, showNoLives);
  return (
    <View style={stylesObject.progressBarPlaceholder}>
      <View style={stylesObject.progressBarPlaceholderNorth}>
        <View style={stylesObject.progressBarCollection}>
          <TouchableOpacity disabled={showNoLives} onPress={pressFunction}>
            <Ionicons
              name={"md-arrow-back"}
              size={32}
              color={
                showNoLives
                  ? "rgba(0,0,0,0.3)"
                  : isDark
                  ? "#818281"
                  : "rgba(0,0,0,0.35)"
              }
            />
          </TouchableOpacity>
        </View>
        <View style={stylesObject.progressBarEmpty}>
          <View
            style={getProgressForPoints(
              points,
              questionsSeen,
              totalQuestionSize
            )}
          ></View>
        </View>
      </View>
    </View>
  );
}
