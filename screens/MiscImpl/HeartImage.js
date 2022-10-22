import * as React from "react";
import Svg, { Path, Ellipse } from "react-native-svg";

export default function HeartImage({ inline, locked }) {
  return (
    <Svg
      style={
        inline
          ? {}
          : {
              flex: 1,
              position: "absolute",
              maxWidth: 44,
              maxHeight: 44,
              marginTop: -10,
              width: 44,
              height: 44,
            }
      }
      width={208}
      height={173}
      height="100%"
      width="100%"
      top={0}
      left={0}
      viewBox="0 0 400 400"
    >
      <Path
        d="M73.808 152.888C19.555 112.552.158 87.037.001 55.801-.143 27.325 23.803-.158 48.618 0 61.009.08 87.59 10.56 97.002 19.079c4.743 4.291 6.99 3.868 17.548-3.307 28.736-19.526 56.797-19.936 74.97-1.095 29.046 30.113 23.758 66.074-15.2 103.374-20.713 19.831-65.945 55.013-70.729 55.013-1.455 0-14.857-9.08-29.782-20.176z"
        fill={!locked ? "#b73e3e" : "#c4c4c4"}
      />
      <Ellipse
        stroke="null"
        ry={22.5}
        rx={24.5}
        cy={52.18004}
        cx={168.22504}
        fill={!locked ? "#e88686" : "#c4c4c4"}
      />
    </Svg>
  );
}
