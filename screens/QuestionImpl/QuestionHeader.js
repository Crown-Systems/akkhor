import * as React from "react";
import { StyleSheet, View } from "react-native";
import { MonoText } from "../../components/StyledText";
import { useTheme } from "../../components/ThemeContext.js";

const styles = (isDark, colors, showNoLives) =>
  StyleSheet.create({
    questionHeaderPlaceholder: {
      marginBottom: 13,
    },
    textStyle: {
      fontSize: 18,
      paddingLeft: 6,
      fontWeight: "bold",
      color: showNoLives ? "rgba(0,0,0,0.3)" : colors.text,
    },
  });

export default function QuestionHeader({ questionTitle, showNoLives }) {
  const { isDark, colors } = useTheme();
  return (
    <View style={styles(isDark, colors, showNoLives).questionHeaderPlaceholder}>
      <MonoText style={styles(isDark, colors, showNoLives).textStyle}>
        {questionTitle}
      </MonoText>
    </View>
  );
}
