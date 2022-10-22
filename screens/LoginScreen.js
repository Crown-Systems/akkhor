import * as React from "react";
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
import { backendUrl } from "../constants/Environment.js";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";
import * as SecureStore from "expo-secure-store";
import { loginUser, useAuthDispatch } from "../context/Index.js";
import * as Linking from "expo-linking";

async function handleSignIn(data) {
  if (data.error) {
    console.log("Got an error: " + data.error);
    return;
  }
  var isMobile = await SecureStore.isAvailableAsync();
  if (isMobile) {
    const credentials = {
      id: data.id,
      authToken: data.token,
      deviceId: data.deviceId,
      username: data.username,
      timestamp: data.timestamp,
    };
    try {
      await SecureStore.setItemAsync(
        "authentication_data",
        JSON.stringify(credentials)
      );
      props.history.push("/dashboard");
    } catch (e) {
      console.log(e);
    }
  }
}

export default function LoginScreen({ navigation, setLoggedIn, setAuthToken }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const window = useWindowDimensions();
  const dispatch = useAuthDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    var isMobile = await SecureStore.isAvailableAsync();
    let deviceId = isMobile ? "must change" : uuidv4();

    try {
      let response = await loginUser(dispatch, {
        email: username,
        password,
        deviceId: deviceId,
      });
      if (!response || !response.username) {
        return;
      }
      setAuthToken(response.token);
      handleSignIn(response);
      setLoggedIn(true);
      navigation.navigate("ChooseCategory");
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (values) => {
    handleLogin(values);
  };

  var styleDynamic = StyleSheet.create({
    container: {
      /*  textShadowColor: "#585858",
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
      justifyContent: "center",
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

          <Text style={styles.header}>Test for credentials</Text>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
              >
                <View style={styles.inner}>
                  <View>
                    <TextInput
                      placeholder="Username"
                      name="username"
                      onChangeText={(a) => setUsername(a)}
                      placeholderColor="#c4c3cb"
                      style={styles.textInput}
                    />
                    <TextInput
                      placeholder="Password"
                      name="password"
                      placeholderColor="#c4c3cb"
                      style={styles.textInput}
                      secureTextEntry={true}
                      onChangeText={(value) => setPassword(value)}
                    />
                    <View style={{ marginTop: 24 }}>
                      <FontAwesome.Button
                        onPress={(a) => onSubmit(a)}
                        style={styles.loginButtonStyle}
                        backgroundColor="#78c800"
                        fontSize="2x"
                      >
                        <Text style={{ color: "#fff" }}>LOG IN</Text>
                      </FontAwesome.Button>
                    </View>
                    <View style={{ marginTop: 24 }}>
                      <FontAwesome.Button
                        onPress={() => {
                          Linking.openURL(backendUrl + "/google").catch((err) =>
                            console.error("Couldn't load page", err)
                          );
                        }}
                        style={styles.loginButtonStyle}
                        name="google"
                        backgroundColor="#dc4e41"
                        fontSize="2x"
                      >
                        <Text style={{ color: "#fff" }}>
                          {" "}
                          Sign in with Google
                        </Text>
                      </FontAwesome.Button>
                    </View>
                    <View style={{ marginTop: 24 }}>
                      <FontAwesome.Button
                        onPress={() => {
                          Linking.openURL(backendUrl + "/apple/login").catch(
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
                          Sign in with Apple
                        </Text>
                      </FontAwesome.Button>
                    </View>

                    <View style={styles.textAlreadyHasAccount}>
                      <Text>
                        Not a member?{" "}
                        <Text
                          style={{ color: "#dc4e41" }}
                          onPress={() => navigation.navigate("Register")}
                        >
                          Register now!
                        </Text>
                      </Text>

                      <Text
                        style={{ color: "#dc4e41" }}
                        onPress={() => navigation.navigate("ForgotPassword")}
                      >
                        Forgot password?
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

LoginScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 30,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: 0,
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    padding: 24,
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
    borderColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
});
