import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { backendUrl } from "../constants/Environment.js";

var styles = StyleSheet.create({
  item: {
    margin: 6,
    width: 110,
    height: 140,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 16,
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
});

const LevelGridItem = (props) => {
  let resultUri = `${backendUrl}/levels/view-image/${parseFloat(
    props.item.id
  )}`;
  if (props.locked) {
    resultUri = "";
  }
  return (
    <View style={{}} contentContainerStyle={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <View style={styles.item}>
          {props.locked ? (
            <Image
              style={{ height: "100%", width: "100%", alignItems: "center" }}
              source={require("../assets/images/padlock.png")}
            ></Image>
          ) : (
            <Image
              style={{ height: "100%", width: "100%", alignItems: "center" }}
              source={{
                uri:
                  backendUrl +
                  "/levels/view-image/" +
                  parseFloat(props.item.id),
              }}
            ></Image>
          )}
        </View>
      </View>
    </View>
  );
};

export default LevelGridItem;
