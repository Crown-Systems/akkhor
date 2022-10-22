import * as React from "react";
import { Platform, View } from "react-native";
import { MonoText } from "../../components/StyledText";

import RedGem from "./RedGem.js";
import YellowGem from "./YellowGem.js";
import BlueGem from "./BlueGem.js";
import { SafeAreaView } from "react-native";

import { useWindowDimensions } from "react-native";
import HeartImage from "../MiscImpl/HeartImage";

export default function ScoreBar({ red_gems, yellow_gems, blue_gems, hearts }) {
  return (
    <SafeAreaView
      style={{
        height: 40,
        position: "relative",
        resizeMode: "contain",
        alignItems: "center",
        justifyContent: "center",
        /**
         * For some reason on android it doesn't like the 0 top.
         */
        top: Platform.OS === "android" ? 16 : 0,
        flexGrow: 1,
        flexDirection: "row",
        flex: 1,
        fontWeight: "bold",
      }}
    >
      <View style={{}}>
        <RedGem locked={red_gems < 1 ? true : false} />
        <MonoText
          style={{
            flex: 3,
            color: red_gems < 1 ? "#fff" : "#fc000a",
            position: "relative",
            marginLeft: 28,
            fontSize: 18,
            fontWeight: "bold",
            marginTop: -12,
          }}
        >
          {red_gems ? red_gems + "" : 0}
        </MonoText>
      </View>
      <View style={{ marginLeft: 54 }}>
        <YellowGem locked={yellow_gems < 1 ? true : false} />
        <MonoText
          style={{
            flex: 3,
            color: yellow_gems < 1 ? "#fff" : "#E5AE36",
            position: "relative",
            marginLeft: 20,
            fontSize: 18,
            fontWeight: "bold",
            marginTop: -12,
          }}
        >
          {yellow_gems ? yellow_gems + "" : 0}
        </MonoText>
      </View>
      <View style={{ marginLeft: 48 }}>
        <BlueGem locked={blue_gems < 1 ? true : false} />
        <MonoText
          style={{
            flex: 3,
            color: blue_gems < 1 ? "#fff" : "#0fd5fc",
            position: "relative",
            marginLeft: 28,
            fontSize: 18,
            fontWeight: "bold",
            marginTop: -12,
          }}
        >
          {blue_gems ? blue_gems + "" : 0}
        </MonoText>
      </View>
      <View style={{ marginLeft: 32 }}>
        <HeartImage locked={hearts < 1 ? true : false} />
        <MonoText
          style={{
            flex: 3,
            color: hearts < 1 ? "#fff" : "#fc000a",
            position: "relative",
            marginLeft: 28,
            fontSize: 18,
            fontWeight: "bold",
            marginTop: -12,
          }}
        >
          {hearts ? hearts + "" : 0}
        </MonoText>
      </View>
    </SafeAreaView>
  );
}
