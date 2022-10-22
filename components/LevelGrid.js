import * as React from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LevelGridItem from "./LevelGridItem.js";
import { MonoText } from "./StyledText";
import { useTheme } from "./ThemeContext.js";

function isComplete(item, progress) {
  var progressForItem = progress.find(
    (a) => parseInt(a.levelId) === parseInt(item.id)
  );
  if (!progressForItem) {
    return false;
  }
  if (parseInt(progressForItem.progress) === 1) {
    return true;
  }
  return false;
}

function renderUnclickable(item, ourLevel, hearts) {
  if (hasNoHearts(hearts)) {
    return true;
  }
  if (item.questions.length < 1) {
    return true;
  }
  if (isLocked(item, ourLevel)) {
    return true;
  }
  return false;
}

function getUniqueLevelScoreRequirements(data) {
  let uniqueScoreRequirements = [];
  data.forEach((a) => {
    if (!uniqueScoreRequirements.includes(a.level)) {
      uniqueScoreRequirements.push(a.level);
    }
  });
  return uniqueScoreRequirements;
}

/**
 * data = level items array
 *
 * This will find out what our best score is, to identify which levels to lock and unlock.
 */
function getHighestScoreWeHaveCompleted(data, progress) {
  let uniqueScoreRequirements = [];
  data.forEach((a) => {
    if (!uniqueScoreRequirements.includes(a.level)) {
      uniqueScoreRequirements.push(a.level);
    }
  });

  let levelWeAreAt = 0;
  let requirements = getUniqueLevelScoreRequirements(data);

  for (var i = 0; i < requirements.length; i++) {
    var realScore = requirements[i];
    /**
     * Filter all levels that match {realScore}
     */
    let passedAll = true;
    let startNew = data.filter((fil) => parseInt(fil.level) === realScore);
    for (var a of startNew) {
      var localId = a.id;
      var filterProgress = progress.filter(
        (fp) => fp.levelId === localId && fp.progress > 0
      );
      if (!filterProgress || filterProgress.length < 1) {
        /**
         * If we don't find any progress, then we haven't passed all.
         */
        passedAll = false;
      }
    }
    if (passedAll) {
      return realScore;
    }
  }
  return levelWeAreAt;
}

function isLocked(item, ourLevel, hearts) {
  /**
   * Check lives.
   */
  if (hasNoHearts(hearts)) {
    /**
     * If we have no hearts left, then automatically lock the level.
     */
    return true;
  }
  return item.level > parseInt(ourLevel) + 1;
}

function hasNoHearts(hearts) {
  return hearts < 1;
}

function renderBlock(item, ourLevel, progress, hearts) {
  if (hasNoHearts(hearts)) {
    return "Need Hearts";
  }
  if (isComplete(item, progress)) {
    return "Complete";
  }
  if (isLocked(item, ourLevel, hearts)) {
    return "Locked";
  }
  if (item.questions.length < 1) {
    /**
     * Level has no questions.
     */
    return item.name + " (Empty)";
  }
  return item.name;
}

const LevelGrid = (props) => {
  const { colors } = useTheme();
  const lives = props.hearts;

  getUniqueLevelScoreRequirements(props.items);
  const ourLevel = getHighestScoreWeHaveCompleted(props.items, props.progress);

  if (!props.progress) {
    return null;
  }

  var styles = StyleSheet.create({
    grid: {
      marginBottom: 32,
      marginTop: 24,
      flex: 1,
      flexDirection: "column",
      alignContent: "stretch",
      flexWrap: "wrap",
      paddingTop: 30,
      flexBasis: "25%",
      backgroundColor: colors.background,
      paddingBottom: 100,
    },
  });

  return (
    <ScrollView>
      <FlatList
        contentContainerStyle={styles.grid}
        numColumns={3}
        data={props.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{ maxWidth: 120 }}
              disabled={
                !renderUnclickable(item, ourLevel, lives) ? false : true
              }
              key={index.toString()}
              onPress={() => props.selectLevel(item.id)}
            >
              <LevelGridItem
                item={item}
                index={index}
                locked={isLocked(item, ourLevel, lives) ? true : false}
              />
              <MonoText
                style={{
                  color: colors.text,
                  paddingBottom: 18,
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {renderBlock(item, ourLevel, props.progress, lives)}
              </MonoText>
            </TouchableOpacity>
          );
        }}
      />
    </ScrollView>
  );
};

export default LevelGrid;
