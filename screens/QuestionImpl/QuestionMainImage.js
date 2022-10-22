import * as React from "react";
import { StyleSheet, Image } from "react-native";

const styles = (showNoLives) =>
  StyleSheet.create({
    questionHeaderPlaceholder: {
      marginTop: 14,
      marginBottom: 13,
    },
    textStyle: {
      fontSize: 18,
      paddingLeft: 6,
      paddingTop: 12,
      fontWeight: "bold",
    },
    tinyLogo: {
      width: "100%",
      height: "35%",
      marginBottom: 12,
      opacity: showNoLives ? 0.5 : 1.0,
    },
  });

export default function QuestionMainImage({ imageSource, showNoLives }) {
  return (
    <Image
      style={styles(showNoLives).tinyLogo}
      source={{
        uri: imageSource,
      }}
    ></Image>
  );
}
