import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { MonoText } from "./StyledText.js";
import { backendUrl } from "../constants/Environment.js";
import { useTheme } from "./ThemeContext.js";

var styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 148,
    width: 128,
    maxHeight: 148,
    maxWidth: 128,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderRadius: 24,
    overflow: "hidden",
  },
});

const QuestionDisplayItem = (props) => {
  var { colors } = useTheme();

  if (!colors) {
    return <View>
      
    </View>;
  }

  if (!props) {
    return <View></View>;
  }

  return (
    <View style={{}} contentContainerStyle={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          width: 340,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 16,
        }}
      >
        <View style={styles.item}>
          <Image
            style={{ height: "100%", width: "100%" }}
            source={{
              uri: `${backendUrl}/categories/view-image/${props.item.id}`,
            }}
          ></Image>
        </View>
        <View style={{ flex: 1 }}>
          <MonoText
            style={{
              color: colors.text,
              fontSize: 18,
              paddingLeft: 12,
              paddingTop: 12,
              fontWeight: "bold",
            }}
          >
            {props.item.name}
          </MonoText>
          <MonoText
            style={{
              color: colors.text,
              marginTop: 8,
              paddingLeft: 12,
              fontSize: 16,
            }}
          >
            {props.item.description}
          </MonoText>
          <MonoText
            style={{
              color: "#000",
              marginTop: 8,
              paddingLeft: 12,
              fontSize: 16,
            }}
          >
            Click Here to Play
          </MonoText>
        </View>
      </View>
    </View>
  );
};

export default QuestionDisplayItem;
