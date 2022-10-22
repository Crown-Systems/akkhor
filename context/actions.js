import { backendUrl } from "../constants/Environment.js";

import * as SecureStore from "expo-secure-store";
const ROOT_URL = backendUrl + "/app";

export async function loginUser(dispatch, loginPayload) {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginPayload),
  };

  try {
    /**
     * Remember, we do /app/login/ because in this route we're saving the auth token
     * inside the localstorage. In react native/mobile apps that's fine since
     * it's not prone to xss, but in the dashboard/admin panel we need to avoid
     * local storage and use httpOnly cookies to prevent xss.
     */
    dispatch({ type: "REQUEST_LOGIN" });
    let response = await fetch(`${ROOT_URL}/login`, requestOptions);
    let data = await response.json();

    if (data.username) {
      dispatch({ type: "LOGIN_SUCCESS", payload: data });

      var isAllowed = await SecureStore.isAvailableAsync();
      if (!isAllowed) {
        localStorage.setItem("authentication_data", JSON.stringify(data));
      } else {
        await SecureStore.setItemAsync(
          "authentication_data",
          JSON.stringify(data)
        ).then((ll) => {
          /**
           * Optional, send a success message but not needed.
           */
        });
      }
      return data;
    }

    dispatch({ type: "LOGIN_ERROR", error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
  }
}

export async function logout(dispatch) {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("authentication_data");
}

/**
 *
 * @param {*} dispatch - the action
 * @param {*} resetPayload - the email/details to reset for
 */
export async function resetPassword(dispatch, resetPayload) {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetPayload),
  };

  try {
    /**
     * Remember, we do /app/login/ because in this route we're saving the auth token
     * inside the localstorage. In react native/mobile apps that's fine since
     * it's not prone to xss, but in the dashboard/admin panel we need to avoid
     * local storage and use httpOnly cookies to prevent xss.
     */
    dispatch({ type: "REQUEST_PASSWORD_RESET" });
    let response = await fetch(`${ROOT_URL}/forgotpassword`, requestOptions);
    let data = await response.json();
    dispatch({ type: "PASSWORD_LINK_SENT", payload: data });
    return data;
  } catch (error) {
    dispatch({ type: "PASSWORD_RESET_ERROR", error: error });
  }
}
