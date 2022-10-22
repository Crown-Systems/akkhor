import { Platform } from "react-native";
import { backendUrl } from "../constants/Environment.js";
import { getProductsAsync, purchaseItemAsync } from "expo-in-app-purchases";

const BUY_HIDE_ADS_ID_IOS = 4545;
const BUY_HIDE_ADS_ID_ANDROID = 234234;

export async function buyItem(userDetails, myUserSettings, authToken, item) {
  let desc = item.item;
  let cost = item.cost;
  let canAfford =
    item.currency !== "USD" && parseInt(userDetails.red_gems) >= parseInt(cost);

  let success = false;

  if (!canAfford) {
    return false;
  }

  if (desc === "Techno Soundpack") {
    let url = `${backendUrl}/marketplace/buy/technopack/id/${userDetails.id}`;
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({}),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          userDetails.red_gems = userDetails.red_gems - 1500;

          /**
           * Update the backend for the setting chosen by the user.
           */
          fetch(backendUrl + "/user-settings/edit/" + userDetails.id, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify({
              userId: userDetails.id,
              settingDescription: "Techno Soundpack",
              value: "true",
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data) {
                let resultDataFiltered = data.find((a) => a !== null);
                let findExistingSetting = myUserSettings.find(
                  (ab) =>
                    ab.id > 0 &&
                    ab.setting !== null &&
                    ab.setting.description === "Techno Soundpack"
                );
                success = true;
                if (findExistingSetting) {
                  findExistingSetting.rawValue = "true";
                } else {
                  myUserSettings.push(resultDataFiltered);
                }
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
  } else if (desc === "Unlimited Lives") {
    let url = `${backendUrl}/marketplace/buy/unlimitedlives/id/${userDetails.id}`;
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({}),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          userDetails.red_gems = userDetails.red_gems - 1500;

          /**
           * Update the backend for the setting chosen by the user.
           */
          fetch(backendUrl + "/user-settings/edit/" + userDetails.id, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify({
              userId: userDetails.id,
              settingDescription: desc,
              value: new Date(),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data) {
                let resultDataFiltered = data.find((a) => a !== null);
                let findExistingSetting = myUserSettings.find(
                  (ab) =>
                    ab.id > 0 &&
                    ab.setting !== null &&
                    ab.setting.description === desc
                );
                success = true;
                if (findExistingSetting) {
                  findExistingSetting.rawValue = new Date();
                } else {
                  myUserSettings.push(resultDataFiltered);
                }
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
  } else if (desc === "More Life") {
    let url = `${backendUrl}/marketplace/buy/morelives/id/${userDetails.id}`;
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({}),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          userDetails.red_gems = userDetails.red_gems - 500;

          /**
           * Update the backend for the setting chosen by the user.
           */
          fetch(backendUrl + "/users/edit/" + userDetails.id, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify({
              hearts: userDetails.hearts + 5,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data) {
                userDetails.hearts = userDetails.hearts + 5;
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
  } else if (desc === "Hide Ads") {
    /**
     * Handled via In-App-Purchases (IAP)
     */
    try {
      const items = Platform.select({
        ios: [BUY_HIDE_ADS_ID_IOS],
        android: [BUY_HIDE_ADS_ID_ANDROID],
      });

      const subscription_plan =
        Platform.OS === "android"
          ? BUY_HIDE_ADS_ID_ANDROID
          : BUY_HIDE_ADS_ID_IOS;

      const products = await getProductsAsync(items);

      if (products.results.length > 0) {
        await purchaseItemAsync(subscription_plan);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  }
  return success;
}
