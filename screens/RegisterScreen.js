import * as React from "react";
import { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import { FontAwesome } from "@expo/vector-icons";
import { backendUrl } from "../constants/Environment.js";
import { v4 as uuidv4 } from "uuid";
import * as SecureStore from "expo-secure-store";
import { loginUser, useAuthDispatch } from "../context/Index.js";

export default function RegisterScreen({
  navigation,
  setLoggedIn,
  setAuthToken,
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const window = useWindowDimensions();

  const dispatch = useAuthDispatch();

  function validateForm() {
    if (!email) {
      return false;
    }
    return email.length > 0 && password.length > 0;
  }

  function continueWithGoogle() {
    Linking.openURL(backendUrl + "/google").catch((err) =>
      console.error("Couldn't load page", err)
    );
  }

  async function signUp(event) {
    if (!validateForm()) {
      return;
    }
    if (confirmPassword !== password) {
      return;
    }
    fetch(`${backendUrl}/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        referralCode: referralCode,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          /**
           * Handle login now, so it can generate the token etc.
           */
          var isMobile = await SecureStore.isAvailableAsync();
          let deviceId = isMobile ? "must change" : uuidv4();

          try {
            let response = await loginUser(dispatch, {
              email: email,
              password,
              deviceId: deviceId,
            });
            if (!response || !response.username) {
              return;
            }
            setAuthToken(response.token);
            setLoggedIn(true);
            navigation.navigate("ChooseCategory");
          } catch (error) {
            console.log(error);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  var styleDynamic = StyleSheet.create({
    container: {
      /* textShadowColor: "#585858",
      textShadowOffset: { width: 5, height: 5 },
      textShadowRadius: 10, */
      alignItems: window.width > 900 ? "center" : "stretch",
      marginTop: 10,
      marginBottom: 0,
    },
    nextContainer: {
      marginBottom: 32,
      marginTop: 0,
      alignItems: window.width > 900 ? "center" : "stretch",
      minHeight: 600,
      flex: 1,
      paddingTop: 30,
      flexGrow: 1,
    },
  });

  return (
    <ScrollView
      style={{
        backgroundColor: "#78c800",
      }}
    >
      <View style={styleDynamic.container} activeOpacity={1}>
        <View style={styleDynamic.nextContainer}>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/Akkhor-Logo-recolored.png")}
              style={styles.welcomeImage}
            />
          </TouchableOpacity>
          <Text style={newStyles.header}>Create your account</Text>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={newStyles.container}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                style={newStyles.container}
                contentContainerStyle={styles.contentContainer}
              >
                <View style={newStyles.inner}>
                  <View>
                    <View>
                      <FontAwesome.Button
                        onPress={() => continueWithGoogle()}
                        style={styles.loginButtonStyle}
                        name="google"
                        backgroundColor="#dc4e41"
                        fontSize="4px"
                      >
                        <Text style={{ color: "#fff" }}>
                          {" "}
                          Continue with Google
                        </Text>
                      </FontAwesome.Button>
                    </View>
                    <View style={{ marginTop: 24 }}>
                      <FontAwesome.Button
                        onPress={() => {
                          Linking.openURL(backendUrl + "/apple/login/").catch(
                            (err) => console.error("Couldn't load page", err)
                          );
                        }}
                        style={styles.loginButtonStyle}
                        name="apple"
                        backgroundColor="#000"
                        fontSize="2x"
                      >
                        <Text style={{ color: "#fff" }}>
                          {" "}
                          Continue with Apple
                        </Text>
                      </FontAwesome.Button>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",

                        paddingBottom: 16,
                      }}
                    >
                      <View
                        style={{ flex: 1, height: 1, backgroundColor: "black" }}
                      />
                      <View>
                        <Text style={{ width: 36, textAlign: "center" }}>
                          or
                        </Text>
                      </View>
                      <View
                        style={{ flex: 1, height: 1, backgroundColor: "black" }}
                      />
                    </View>

                    <TextInput
                      placeholder="E-mail address"
                      placeholderColor="#c4c3cb"
                      style={newStyles.textInput}
                      onChangeText={(e) => setEmail(e)}
                      onChanged={(e) => setEmail(e.target.value)}
                    />
                    <TextInput
                      placeholder="Username"
                      placeholderColor="#c4c3cb"
                      style={newStyles.textInput}
                      onChangeText={(e) => setUsername(e)}
                      onChanged={(e) => setUsername(e.target.value)}
                    />
                    <TextInput
                      placeholder="Password"
                      placeholderColor="#c4c3cb"
                      style={newStyles.textInput}
                      secureTextEntry={true}
                      onChangeText={(e) => setPassword(e)}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextInput
                      placeholder="Confirm password"
                      placeholderColor="#c4c3cb"
                      style={newStyles.textInput}
                      secureTextEntry={true}
                      onChangeText={(e) => setConfirmPassword(e)}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <TextInput
                      placeholder="ReferralCode"
                      placeholderColor="#c4c3cb"
                      style={newStyles.textInput}
                      onChangeText={(e) => setReferralCode(e)}
                      onChanged={(e) => setReferralCode(e.target.value)}
                    />
                    <FontAwesome.Button
                      onPress={(e) => signUp(e)}
                      style={styles.loginButtonStyle}
                      backgroundColor="#78c800"
                      fontSize="2x"
                    >
                      <Text style={{ color: "#fff" }}> Sign up</Text>
                    </FontAwesome.Button>

                    <View style={styles.textAlreadyHasAccount}>
                      <Text>
                        Have an account?{" "}
                        <Text
                          style={{ color: "#dc4e41" }}
                          onPress={() => navigation.navigate("Login")}
                        >
                          Login here
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </View>
    </ScrollView>
  );
}

RegisterScreen.navigationOptions = {
  header: null,
};

const newStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewItem: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 24,
  },
  inner: {
    paddingLeft: 24,
    paddingRight: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
    color: "#fff",
  },
  textInput: {
    height: 40,
    borderColor: "#ffba08",
    borderBottomWidth: 1,
    marginBottom: 6,
  },
  btnContainer: {
    backgroundColor: "#fff",
    marginTop: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  loginButtonStyle: {
    color: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  textAlreadyHasAccount: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 16,
  },
});
