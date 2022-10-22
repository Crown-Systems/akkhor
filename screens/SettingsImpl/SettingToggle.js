import React from "react";
import { Switch } from "react-native";

const SettingToggle = () => {
  return (
    <Switch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={props.selected ? "#f5dd4b" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={selectFunction}
      value={props.selected}
    />
  );
};

export default SettingToggle;
