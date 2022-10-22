import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import PropTypes from "prop-types";
import { MonoText } from "../components/StyledText";
import { Dimensions, useWindowDimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
  const window = useWindowDimensions();

  const screenHeight = Dimensions.get("screen").height;

  function getStarted() {
    navigation.navigate("Register");
  }

  function alreadyHaveAccount() {
    navigation.navigate("Login");
  }

  return (
    <View
      style={
        window.width > 900
          ? {
              marginTop: 0,
              alignItems: "center",
              minHeight: 600,
              backgroundColor: "#78c800",
              flex: 1,
              paddingTop: 30,
              flexGrow: 1,
              height: screenHeight,
            }
          : {
              backgroundColor: "#78c800",
              height: window.height,
            }
      }
    >
      <View
        style={{
          flex: 5,
          flexDirection: "row",
          backgroundColor: "#78c800",
          height: "100%",
          minHeight: 460,
          top: 0,
          left: 0,
          width: window.width > 900 ? 350 : window.width,
          height: screenHeight,
        }}
      >
        <View
          style={{
            flex: 1,
            top: 0,
            left: 0,
            alignItems: window.width > 900 ? "center" : "stretch",
            width: window.width > 900 ? 350 : window.width,
            height: screenHeight,
          }}
        >
          <TouchableOpacity onPress={getStarted}>
            <Image
              source={require("../assets/images/Akkhor-Logo-recolored.png")}
              style={styles.welcomeImage}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            bottom: 0,
            height: 420,
            alignSelf: "flex-end",
            justifyContent: "center",
            width: window.width > 900 ? 350 : window.width,
          }}
        >
          <TouchableOpacity style={styles.buttonSubmit} onPress={getStarted}>
            <MonoText style={styles.buttonSubmitText}>GET STARTED</MonoText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSubmit}
            onPress={alreadyHaveAccount}
          >
            <MonoText style={styles.buttonSubmitText}>
              I ALREADY HAVE AN ACCOUNT
            </MonoText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

HomeScreen.propTypes = {
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  buttonSubmit: {
    marginBottom: 30,
    borderWidth: "2px 2px 2px 2px",
    borderStyle: "solid",
    borderRadius: 10,
    borderColor: "yellow",
    backgroundColor: "#78c800",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
    borderColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0,
    shadowRadius: 4.65,

    elevation: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  buttonSubmitText: {
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    fontSize: 15,
    margin: 8,
    fontWeight: "700",
    color: "#fff",
  },
  welcomeImage: {
    width: 200,
    height: 200,
    left: screenWidth > 900 ? screenWidth / 8 - 55 : screenWidth / 2 - 100,
    top: "10%",
  },
});
