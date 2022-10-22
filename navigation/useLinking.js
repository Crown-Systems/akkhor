import { useLinking } from "@react-navigation/native";

import * as Linking from "expo-linking";

export default function (containerRef) {
  return useLinking(containerRef, {
    prefixes: [Linking.makeUrl("/")],
    config: {
      Root: {
        path: "root",
        screens: {
          Home: {
            path: "home/:id",
            screens: {
              InvalidSettings: "*",
            },
          },
          Links: "links",
          Profile: "profile",
          Question: {
            path: "question/:id",
            screens: {
              InvalidSettings: "*",
            },
          },
          NotFound: "*",
        },
      },
    },
    getStateFromPath(path, config) {},
  });
}
