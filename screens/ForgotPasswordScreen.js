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
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { resetPassword, useAuthDispatch } from "../context/Index.js";

export default function ForgotPasswordScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const window = useWindowDimensions();
  const dispatch = useAuthDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await resetPassword(dispatch, {
        email: username,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (values) => {
    handleLogin(values);
    navigation.navigate("HomeScreen");
  };

  var styleDynamic = StyleSheet.create({
    container: {
      /*  textShadowColor: "#585858",
      textShadowOffset: { width: 5, height: 5 },
      textShadowRadius: 10, */
      alignItems: window.width > 900 ? "center" : "stretch",

      marginTop: 10,
      marginBottom: 0,
      height: 500,
    },
    nextContainer: {
      marginBottom: 32,
      marginTop: 0,
      alignItems: window.width > 900 ? "center" : "stretch",

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
      <TouchableOpacity style={styleDynamic.container} activeOpacity={1}>
        <View style={styleDynamic.nextContainer}>
          <Image
            source={require("../assets/images/Akkhor-Logo-recolored.png")}
            style={styles.welcomeImage}
          />
          <Text style={styles.header}>Password Reset</Text>
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
                    <FontAwesome.Button
                      onPress={(a) => onSubmit(a)}
                      style={styles.loginButtonStyle}
                      backgroundColor="#78c800"
                      fontSize="2x"
                    >
                      <Text style={{ color: "#fff" }}>Submit</Text>
                    </FontAwesome.Button>
                    <View style={styles.textAlreadyHasAccount}>
                      <Text>
                        <Text
                          style={{ color: "#c63927" }}
                          onPress={() => navigation.navigate("HomeScreen")}
                        >
                          Go Back
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

ForgotPasswordScreen.navigationOptions = {
  header: null,
};

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
    borderColor: "#ffea00",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
});
