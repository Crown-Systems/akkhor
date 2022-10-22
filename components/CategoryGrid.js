import * as React from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";

import CategoryGridItem from "./CategoryGridItem.js";
import { useTheme } from "./ThemeContext.js";

const CategoryGrid = (props) => {
  const { colors } = useTheme();

  var styles = StyleSheet.create({
    grid: {
      marginBottom: 32,
      marginTop: 0,
      alignItems: "center",
      minHeight: 1200,
      backgroundColor: colors.background,
      flex: 1,
      paddingTop: 30,
      flexGrow: 1,
    },
  });

  if (!props) {
    return <></>;
  }

  if (!props.items || props.items.length < 1) {
    return (
      <ScrollView>
        <Text>No categories in database.</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <FlatList
        contentContainerStyle={styles.grid}
        style={{ paddingBottom: 200 }}
        data={props.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{ flex: 1, maxHeight: 200 }}
              key={index.toString()}
              onPress={() => {
                props.selectFunction(item.id);
              }}
            >
              <CategoryGridItem item={item} index={index} theme={colors} />
            </TouchableOpacity>
          );
        }}
      />
    </ScrollView>
  );
};

export default CategoryGrid;
