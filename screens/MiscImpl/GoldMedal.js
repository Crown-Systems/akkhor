import * as React from "react";
import Svg, { Path, Circle, G } from "react-native-svg";

export default function GoldMedal({ medal }) {
  if (medal === "bronze") {
    return (
      <Svg
        style={{
          flex: 1,
          position: "absolute",
          maxWidth: 32,
          maxHeight: 32,
          width: 32,
          height: 32,
        }}
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        enableBackground="new 0 0 512 512"
      >
        <Path
          d="M387.216 240.042v255.555c0 13.688-15.784 21.334-26.525 12.837l-94.556-74.712a16.398 16.398 0 00-20.303 0l-94.556 74.712c-10.741 8.498-26.525.851-26.525-12.837V240.042h262.465z"
          fill="#80d0e1"
        />
        <Path
          d="M256 240.042v190.16a16.41 16.41 0 0110.135 3.52l94.556 74.712c10.741 8.498 26.525.851 26.525-12.837V240.042H256z"
          fill="#48aee2"
        />
        <Path
          d="M255.984 0C132.665 0 58.387 136.876 124.751 240.05c30.687 47.787 80.963 71.658 131.233 71.653 50.288-.005 100.568-23.902 131.232-71.653C453.748 136.621 379.04 0 255.984 0z"
          fill="#f5b953"
        />
        <Path
          d="M255.984 0v95.015c33.631 0 60.876 27.245 60.876 60.876s-27.262 60.876-60.876 60.876v94.936c50.288-.005 100.568-23.902 131.232-71.653C453.748 136.621 379.04 0 255.984 0z"
          fill="#d69629"
        />
        <Path
          d="M255.984 95.015c-33.631 0-60.876 27.245-60.876 60.876s27.262 60.876 60.876 60.876 60.876-27.245 60.876-60.876-27.245-60.876-60.876-60.876z"
          fill="#fad089"
        />
        <Path
          d="M255.984 95.015v121.752c33.615 0 60.876-27.245 60.876-60.876s-27.245-60.876-60.876-60.876z"
          fill="#ab7822"
        />
      </Svg>
    );
  } else if (medal === "silver") {
    return (
      <Svg
        style={{
          flex: 1,
          position: "absolute",
          maxWidth: 32,
          maxHeight: 32,
          width: 32,
          height: 32,
        }}
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        enableBackground="new 0 0 512 512"
      >
        <Path
          d="M387.216 240.042v255.555c0 13.688-15.784 21.334-26.525 12.837l-94.556-74.712a16.398 16.398 0 00-20.303 0l-94.556 74.712c-10.741 8.498-26.525.851-26.525-12.837V240.042h262.465z"
          fill="#80d0e1"
        />
        <Path
          d="M256 240.042v190.16a16.41 16.41 0 0110.135 3.52l94.556 74.712c10.741 8.498 26.525.851 26.525-12.837V240.042H256z"
          fill="#48aee2"
        />
        <Path
          d="M255.984 0C132.665 0 58.387 136.876 124.751 240.05c30.687 47.787 80.963 71.658 131.233 71.653 50.288-.005 100.568-23.902 131.232-71.653C453.748 136.621 379.04 0 255.984 0z"
          fill="#dbdbdb"
        />
        <Path
          d="M255.984 0v95.015c33.631 0 60.876 27.245 60.876 60.876s-27.262 60.876-60.876 60.876v94.936c50.288-.005 100.568-23.902 131.232-71.653C453.748 136.621 379.04 0 255.984 0z"
          fill="#a3a3a2"
        />
        <Path
          d="M255.984 95.015c-33.631 0-60.876 27.245-60.876 60.876s27.262 60.876 60.876 60.876 60.876-27.245 60.876-60.876-27.245-60.876-60.876-60.876z"
          fill="#e6e6e3"
        />
        <Path
          d="M255.984 95.015v121.752c33.615 0 60.876-27.245 60.876-60.876s-27.245-60.876-60.876-60.876z"
          fill="#c4c4c4"
        />
      </Svg>
    );
  }
  return (
    <Svg
      style={{
        flex: 1,
        position: "absolute",
        maxWidth: 32,
        maxHeight: 32,
        width: 32,
        height: 32,
      }}
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <Path
        d="M186.205 408.076L90.454 503.826 66.108 437.718 0 413.372 82.217 331.155 122.966 290.406 211.543 378.982z"
        fill="#4675cf"
      />
      <Path
        d="M405.487 306.86L512 413.372 445.891 437.718 421.545 503.826 298.975 381.256z"
        fill="#4675cf"
      />
      <Path
        d="M146.568 314.077L34.53 426.115 66.038 437.718 78.385 471.244 191.06 358.569z"
        fill="#4e8fe3"
      />
      <Path
        d="M477.501 426.233L377.778 326.51 325.388 363.103 433.85 471.566 446.315 437.718z"
        fill="#4e8fe3"
      />
      <Path
        d="M405.487 306.876l-106.513 74.395 45.268 45.268c40.657-16.832 75.604-44.65 101.152-79.756l-39.907-39.907zM82.217 331.171l-18.325 18.325c26.069 34.779 61.476 62.152 102.502 78.406l19.81-19.81 25.338-29.094-88.577-88.577-40.748 40.75z"
        opacity={0.23}
        fill="#3f489b"
        enableBackground="new"
      />
      <Path
        d="M275.43 11.923c27.832-9.859 58.816.208 75.536 24.544a65.222 65.222 0 0035.241 25.604c28.312 8.382 47.461 34.738 46.684 64.255a65.227 65.227 0 0013.461 41.428c17.978 23.422 17.978 56.002 0 79.424a65.223 65.223 0 00-13.461 41.428c.777 29.517-18.372 55.873-46.684 64.255a65.226 65.226 0 00-35.241 25.604c-16.721 24.336-47.705 34.403-75.536 24.544a65.222 65.222 0 00-43.56 0c-27.832 9.859-58.816-.208-75.536-24.544a65.226 65.226 0 00-35.241-25.604c-28.312-8.382-47.461-34.738-46.684-64.255a65.227 65.227 0 00-13.461-41.428c-17.978-23.422-17.978-56.002 0-79.424a65.223 65.223 0 0013.461-41.428c-.777-29.517 18.372-55.873 46.684-64.255a65.226 65.226 0 0035.241-25.604c16.721-24.336 47.705-34.403 75.536-24.544a65.222 65.222 0 0043.56 0z"
        fill="#cca400"
      />
      <Circle cx={253.646} cy={207.466} r={154.651} fill="#eebf00" />
      <Path
        d="M237.07 141.954L212.717 141.954 212.717 179.386 237.07 179.386 237.07 283.564 274.502 283.564 274.502 179.386 274.502 141.954z"
        fill="#ffeb99"
      />
      <G>
        <Path
          d="M188.354 234.018c17.682 17.682 14.244 49.786 14.244 49.786s-32.105 3.437-49.786-14.244c-17.682-17.682-14.244-49.786-14.244-49.786s32.105-3.438 49.786 14.244zM355.151 269.559c-17.682 17.682-49.786 14.244-49.786 14.244s-3.437-32.105 14.244-49.786 49.786-14.244 49.786-14.244 3.438 32.105-14.244 49.786z"
          fill="#cca400"
        />
      </G>
      <Path
        d="M446.424 167.754a65.223 65.223 0 01-13.461-41.428c.777-29.517-18.372-55.873-46.684-64.255a65.213 65.213 0 01-32.942-22.486c19.976 31.429 31.553 68.72 31.553 108.717 0 112.091-90.868 202.957-202.957 202.957-34.771 0-67.497-8.75-96.104-24.16 8.255 12.085 20.54 21.38 35.336 25.762a65.226 65.226 0 0135.241 25.604c16.721 24.336 47.705 34.403 75.536 24.544a65.235 65.235 0 0143.56 0c27.832 9.859 58.816-.208 75.536-24.544a65.222 65.222 0 0135.241-25.604c28.312-8.382 47.461-34.739 46.684-64.255a65.227 65.227 0 0113.461-41.428c17.977-23.424 17.977-56.002 0-79.424z"
        opacity={0.14}
        fill="#56361d"
        enableBackground="new"
      />
    </Svg>
  );
}
