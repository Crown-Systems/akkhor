import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function StreakImage() {
  return (
    <Svg
      style={{
        flex: 1,
        position: "absolute",
        maxWidth: 20,
        maxHeight: 20,
        marginTop: -10,
        marginLeft: -4,
        width: 64,
        height: 64,
      }}
      x="0px"
      y="0px"
      viewBox="0 0 280.027 280.027"
      xmlSpace="preserve"
      enableBackground="new 0 0 280.027 280.027"
    >
      <Path
        d="M249.399 96.583h-83.404L216.382 0H88.419L30.628 166.161h79.712L71.906 280.027 249.399 96.583z"
        fill="#efc75e"
      />
      <Path
        d="M101.046 17.598h78.364l-70.584 17.537-43.168 78.758 35.388-96.295z"
        fill="#f5dd9d"
      />
    </Svg>
  );
}
