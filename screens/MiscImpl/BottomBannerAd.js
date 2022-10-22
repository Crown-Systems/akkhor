import * as React from "react";
import { View } from "react-native";

import { AdMobBanner } from "expo-ads-admob";
import { GlobalSettingsContext } from "../../context/GlobalSettingsProvider.js";
import { SafeAreaView } from "react-native";

export default function BottomBannerAd({ advertId }) {
  const { globalSettings } = React.useContext(GlobalSettingsContext);

  React.useEffect(() => {}, [globalSettings, advertId]);

  if (!advertId || advertId.length < 1) {
    return <></>;
  }

  return (
    <SafeAreaView
      style={{
        position: "relative",
        resizeMode: "contain",
        alignItems: "center",
      }}
    >
      <View>
        <AdMobBanner
          adSize="banner"
          adUnitID={advertId}
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={(e) => alert("Error")}
        />
      </View>
    </SafeAreaView>
  );
}
