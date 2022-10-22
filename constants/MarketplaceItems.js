import React, { createContext, useState, useEffect } from "react";
import { View } from "react-native";
/* import HeartImage from "../screens/MiscImpl/HeartImage.js";
import FreezeLives from "../screens/MiscImpl/FreezeLives.js";
import TechnoSoundpack from "../screens/MiscImpl/TechnoSoundpack.js"; */
import HideAdsImage from "../screens/MiscImpl/HideAdsImage.js";
export const MarketplaceItemsContext = createContext();

const MarketplaceItemsProvider = ({ children }) => {
  const [itemsForSale, setItemsForSale] = useState([
    {
      item: "Physics",
      currency: "100 BDT",
      cost: "100",
      locked: false,
      description: "Try our Physics test",
      component: (
        <View style={{ maxWidth: 86, maxHeight: 86, width: 86, height: 86 }}>
          <HideAdsImage inline />
        </View>
      ),
    },
    {
      item: "Chemistry",
      currency: "100 BDT",
      cost: "100",
      locked: false,
      description: "Try our Chemistry test",
      component: (
        <View style={{ maxWidth: 86, maxHeight: 86, width: 86, height: 86 }}>
          <HideAdsImage inline />
        </View>
      ),
    },
    {
      item: "Math",
      currency: " 100 BDT",
      cost: 1000,
      locked: false,
      description: "Try our Math test",
      component: (
        <View style={{ maxWidth: 86, maxHeight: 86, width: 86, height: 86 }}>
          <HideAdsImage inline />
        </View>
      ),
    },
    {
      item: "Computer",
      currency: "100 BDT",
      cost: 1500,
      locked: false,
      description: "Try our Computer test",
      component: (
        <View style={{ maxWidth: 86, maxHeight: 86, width: 86, height: 86 }}>
          <HideAdsImage inline />
        </View>
      ),
    },
  ]);

  useEffect(() => {
    console.log("Marketplace items updated.");
  }, []);

  return (
    <MarketplaceItemsContext.Provider
      value={{
        itemsForSale,
        setItemsForSale,
      }}
    >
      {children}
    </MarketplaceItemsContext.Provider>
  );
};

export default MarketplaceItemsProvider;
