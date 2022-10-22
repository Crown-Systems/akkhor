import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "../components/ThemeContext.js";
import { MonoText } from "../components/StyledText";
import QuestionProgressBar from "./QuestionImpl/QuestionProgressBar.js";
import QuestionHeader from "./QuestionImpl/QuestionHeader.js";
import QuestionMainImage from "./QuestionImpl/QuestionMainImage.js";
import { GlobalSettingsContext } from "../context/GlobalSettingsProvider.js";
import { backendUrl } from "../constants/Environment.js";
import RedGem from "./TopBarImpl/RedGem.js";

import { buyItem } from "../context/BuyMarketplaceItem.js";
import { MarketplaceItemsContext } from "../constants/MarketplaceItems.js";
import VictoryImage from "./MiscImpl/VictoryImage.js";
import LoseImage from "./MiscImpl/LoseImage.js";

/**
 * These must be statically declared because react bundle the package at the start.
 */
const soundAnswerCorrectRegular = require(`../assets/sounds/answer-correct-regular.wav`);
const soundAnswerCorrectTechno = require(`../assets/sounds/answer-correct-techno.wav`);

const soundAnswerIncorrectRegular = require(`../assets/sounds/answer-incorrect-regular.wav`);
const soundAnswerIncorrectTechno = require(`../assets/sounds/answer-incorrect-techno.wav`);

const soundLevelCompleteRegular = require(`../assets/sounds/level-complete-regular.wav`);
const soundLevelCompleteTechno = require(`../assets/sounds/level-complete-techno.wav`);

const soundLevelDefeatRegular = require(`../assets/sounds/level-defeat-regular.wav`);
const soundLevelDefeatTechno = require(`../assets/sounds/level-defeat-techno.wav`);

import { Audio } from "expo-av";

export default function QuestionScreen({
  navigation,
  route,
  levelId,
  authToken,
  username,
  awardPoints,
  userId,
  userDetails,
  myUserSettings,
}) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [currentQuestionId, setCurrentQuestionId] = React.useState(0);
  const [fullQuestions, setFullQuestions] = React.useState([]);

  const window = useWindowDimensions();

  const { itemsForSale, setItemsForSale } = React.useContext(
    MarketplaceItemsContext
  );

  const muteSoundsDescription = "Mute Sounds";
  const technoSoundpackDescription = "Techno Soundpack";

  const [chosenMarketItem, setChosenMarketItem] = React.useState([]);
  const { isDark, colors } = useTheme();

  /*
   * Summary screen, when the lesson completes
   */
  const [isLessonComplete, setLessonComplete] = React.useState(false);

  /*
   * Choice selection, for verifying correct/incorrect answer
   */
  const [selectedChoiceId, setSelectedChoiceId] = React.useState(-1);

  /*
   * Local points
   */
  const [score, setScore] = React.useState(0);

  /**
   * The Question ID result, we filter the view/full-questions/ twice and find it
   */
  const [fullQuestionId, setFullQuestionId] = React.useState(-1);

  const [currentLevelAttemptId, setCurrentLevelAttemptId] = React.useState(-1);

  const [questionAttemptMetrics, setQuestionAttemptMetrics] = React.useState(
    []
  );

  const [currentDate, setCurrentDate] = React.useState(Date.now());

  const [showNoLives, setShowNoLives] = React.useState(false);

  const [allowShowCorrectAnswer, setAllowShowCorrectAnswer] =
    React.useState(true);
  const [isAnswerShown, setAnswerShown] = React.useState(false);
  const [answerPostText, setAnswerPostText] = React.useState("");

  const { globalSettings } = React.useContext(GlobalSettingsContext);

  /**
   * Sounds
   */
  const [soundCorrect, setSoundCorrect] = React.useState();
  const [soundInorrect, setSoundIncorrect] = React.useState();
  const [soundComplete, setSoundComplete] = React.useState();
  const [soundDefeat, setSoundDefeat] = React.useState();

  const [isSoundMuted, setSoundMuted] = React.useState(false);
  const [isTechnoSoundpack, setTechnoSoundpack] = React.useState(false);

  let widescreen = window.width > 900;

  var styleDynamic = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      textShadowColor: "#585858",
      textShadowOffset: { width: 5, height: 5 },
      textShadowRadius: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    nextContainer: {
      marginBottom: 32,
      marginTop: 0,
      alignItems: "center",
      backgroundColor: colors.background,
      width: widescreen ? window.width * 0.25 : window.width,
    },
    screenBorder: {
      width: "100%",
      height: "100%",
      paddingLeft: widescreen ? 0 : 24,
      paddingRight: widescreen ? 0 : 24,
      backgroundColor: colors.background,
      minHeight: window.height,
      height: window.height,
    },
  });

  function setSoundForDescription(desc, sound) {
    if (desc === "complete") {
      setSoundComplete(sound);
    } else if (desc === "correct") {
      setSoundCorrect(sound);
    } else if (desc === "incorrect") {
      setSoundIncorrect(sound);
    } else if (desc === "defeat") {
      setSoundDefeat(sound);
    }
  }

  async function playSound(desc) {
    if (isSoundMuted) {
      return;
    }

    let flavour = isTechnoSoundpack ? "techno" : "regular";
    let prefix = desc.includes("correct") ? "answer" : "level";
    let soundAssetFullTitle = `${prefix}-${desc}-${flavour}.wav`;

    let soundFile = null;

    switch (soundAssetFullTitle) {
      case "answer-correct-regular.wav":
        soundFile = soundAnswerCorrectRegular;
        break;
      case "answer-correct-techno.wav":
        soundFile = soundAnswerCorrectTechno;
        break;

      case "answer-incorrect-regular.wav":
        soundFile = soundAnswerIncorrectRegular;
        break;
      case "answer-incorrect-techno.wav":
        soundFile = soundAnswerIncorrectTechno;
        break;

      case "level-complete-regular.wav":
        soundFile = soundLevelCompleteRegular;
        break;
      case "level-complete-techno.wav":
        soundFile = soundLevelCompleteTechno;
        break;

      case "level-defeat-regular.wav":
        soundFile = soundLevelDefeatRegular;
        break;
      case "level-defeat-techno.wav":
        soundFile = soundLevelDefeatTechno;
        break;
    }

    /**
     * Load the sound asset
     */
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSoundForDescription(desc, sound);
    await sound.playAsync();
  }

  React.useEffect(() => {
    return soundDefeat
      ? () => {
          soundDefeat.unloadAsync();
        }
      : undefined;
  }, [soundDefeat]);

  React.useEffect(() => {
    return soundCorrect
      ? () => {
          soundCorrect.unloadAsync();
        }
      : undefined;
  }, [soundCorrect]);

  React.useEffect(() => {
    return soundInorrect
      ? () => {
          soundInorrect.unloadAsync();
        }
      : undefined;
  }, [soundInorrect]);

  React.useEffect(() => {
    return soundComplete
      ? () => {
          soundComplete.unloadAsync();
        }
      : undefined;
  }, [soundComplete]);

  React.useEffect(() => {
    async function loadGlobalSettings() {
      /**
       * Check for muted sounds
       */
      var result = myUserSettings.find(
        (a) => a.setting && a.setting.description === muteSoundsDescription
      );
      if (result) {
        setSoundMuted(result.rawValue === "true");
      }

      /**
       * Check for techno soundpack
       */
      var result = myUserSettings.find(
        (a) => a.setting && a.setting.description === technoSoundpackDescription
      );
      if (result) {
        setTechnoSoundpack(result.rawValue === "true");
      }

      var settingsShowAnswer = globalSettings.find((a) =>
        a.description.toLowerCase().includes("show correct answer")
      );
      if (settingsShowAnswer) {
        if (settingsShowAnswer.value === "true") {
          setAllowShowCorrectAnswer(true);
        } else {
          setAllowShowCorrectAnswer(false);
        }
      } else {
        /**
         * No setting found matching [show correct answer]
         */
      }

      /**
       * Lock unaffordable ones
       */
      var cloned = [...itemsForSale];
      cloned.forEach((a, b) => {
        if (a.currency === "red_gems") {
          let myGems = userDetails.red_gems;
          if (a.cost > myGems) {
            a.locked = true;
          }
        }
      });
      setItemsForSale(cloned);

      /**
       * Set the market item to [More hearts]
       */
      setChosenMarketItem(itemsForSale.find((a) => a.item === "More Life"));
    }
    loadGlobalSettings();
  }, [showNoLives, globalSettings]);

  async function returnHome(quit) {
    /**
     * Find the user's attempt at this level and flag it as 'quitted'
     */
    if (currentLevelAttemptId < 1) {
      /**
       * Invalid level-attempt-id.
       */
    } else {
      await fetch(
        backendUrl +
          "/level-attempt/" +
          (quit ? "quit" : "complete") +
          "/" +
          userId,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          method: "PUT",
          body: JSON.stringify({
            attemptId: currentLevelAttemptId,
          }),
        }
      )
        .then(async (res) => {})
        .then(async (data) => {})
        .catch((error) => {});
      await fetch(`${backendUrl}/app/level-verify-complete/${userId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
        method: "POST",
        body: JSON.stringify({
          questionAttemptMetrics,
          username: username,
          levelId: levelId,
          red_gems: score > 0 ? parseInt(score) * 5 : 0,
          yellow_gems: score >= questions.length ? 1 : 0,
        }),
      }).then((a) => {
        if (score > 0) {
          if (score >= questions.length) {
            /**
             * Red gems for total questions answered
             */
            awardPoints("red_gems", parseInt(score) * 5);
            /**
             * Yellow gems if user gets all questions correct.
             */
            awardPoints("yellow_gems", 1);
          } else {
            /**
             * Don't award points if you don't complete the level.
             */
          }
        }

        /**
         * Reset score
         */
        setScore(0);
      });
    }

    if (currentQuestionId >= questions.length) {
      setQuestions([]);
      navigation.navigate("ChooseCategory");
    } else {
      setQuestions([]);
      /**
       * We've finished the level, let's go back to the ChooseLevel screen.
       */
      navigation.navigate("ChooseLevel");
    }
  }

  async function onSubmit() {
    var postDate = new Date();
    var timeDiff = postDate - currentDate;
    timeDiff /= 1000;
    var secondsPassed = Math.round(timeDiff);

    if (
      selectedChoiceId > -1 &&
      questions &&
      currentQuestionId > -1 &&
      questions[currentQuestionId]
    ) {
      var questionMetricToPush = {
        questionId: questions[currentQuestionId].id,
        choiceId: questions[currentQuestionId].choices[selectedChoiceId].id,
        secondsPassed: secondsPassed,
        selectedChoice:
          questions[currentQuestionId].choices[selectedChoiceId].title,
        gotAnswerCorrect:
          questions[currentQuestionId].choices[selectedChoiceId].correct,
      };

      let specificArrayInObject = questionAttemptMetrics.slice();
      specificArrayInObject.push(questionMetricToPush);
      setQuestionAttemptMetrics(specificArrayInObject);
    }

    let gotIncorrect =
      selectedChoiceId >= 0 &&
      !questions[currentQuestionId].choices[selectedChoiceId].correct;

    /**
     * Reset the date, and start counting for the new question now
     */
    setCurrentDate(Date.now());

    if (isLessonComplete) {
      returnHome();
      return;
    }

    /**
     * Heart/Lives management, make sure it lowers them and kicks user off the question if ran out of hearts.
     */
    if (!isAnswerShown && gotIncorrect) {
      if (userDetails.hearts > 0) {
        await fetch(`${backendUrl}/users/edit/${userId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          method: "PATCH",
          body: JSON.stringify({
            hearts: userDetails.hearts - 1,
          }),
        }).then((a) => {});
        userDetails.hearts -= 1;
      }

      if (userDetails.hearts < 1) {
        /**
         * Ran out of hearts!
         */
        setShowNoLives(true);
      }
    }

    if (!isAnswerShown) {
      /**
       * Append score
       */
      var title =
        questions[currentQuestionId].choices[selectedChoiceId].correct;
      if (title) {
        setScore((prevScore) => prevScore + 1);
        if (allowShowCorrectAnswer) {
          playSound("correct");
          setAnswerShown(true);
          setAnswerPostText("You got it correct!");
          return;
        }
        if (score + 1 >= questions.length) {
          playSound("complete");
        }
      } else {
        setAnswerShown(true);
        if (allowShowCorrectAnswer) {
          /**
           * Be careful, if there is no [True] value for .correct, then it will throw an error!
           */
          var theCorrectAnswer = questions[currentQuestionId].choices.find(
            (a) => a.correct
          );
          if (!theCorrectAnswer) {
            playSound("incorrect");
            setAnswerPostText(
              "No true choice set for this question: " +
                questions[currentQuestionId].title
            );
          } else {
            playSound("incorrect");
            setAnswerPostText(
              "You got it incorrect. Right answer is: " + theCorrectAnswer.title
            );
          }
        } else {
          playSound("incorrect");
          setAnswerPostText("You got it incorrect!");
        }
        return;
      }
    }

    /**
     * If the correct answer is shown, the submit button will go next.
     */
    if (isAnswerShown) {
      setAnswerShown(false);
      setAnswerPostText("");
      /**
       * Go to the next question
       */
      setCurrentQuestionId((prevQuestionId) => prevQuestionId + 1);
      setSelectedChoiceId(-1);
    } else {
      setAnswerShown(false);
      setAnswerPostText("");
      /**
       * Go to the next question
       */
      setCurrentQuestionId((prevQuestionId) => prevQuestionId + 1);
      setSelectedChoiceId(-1);
    }

    /*
     * We've finished
     */
    if (questions && currentQuestionId + 1 >= questions.length) {
      /**
       * Reset the levels
       */
      if (score + 1 < questions.length) {
        playSound("defeat");
      }
      resetGame();
    }
  }

  /*
   * Forms the text of the question title, also shows the number of questions and the total question count.
   */
  const getQuestionTitle = () => {
    var message = "Waiting...";
    if (questions[currentQuestionId]) {
      var pureTitle = questions[currentQuestionId].title;

      /**
       * Turn on to show current question stage [0/8, 1/8 etc...]
       */
      var showQuestionSize = false;

      if (showQuestionSize) {
        var questionCountAndLimit =
          "(" + (currentQuestionId + 1) + "/" + questions.length + ")";
        message = pureTitle + " " + questionCountAndLimit;
      } else {
        message = pureTitle;
      }
    }
    return message;
  };

  const resetGame = () => {
    setCurrentQuestionId(0);
    setFullQuestionId(-1);
    setSelectedChoiceId(-1);
    setLessonComplete(true);
  };

  function loadQuestions() {
    if (
      fullQuestionId > 0 &&
      fullQuestions &&
      fullQuestions.length > 0 &&
      (!questions || questions.length < 1)
    ) {
      var resultQuestionId = fullQuestions.find(
        (a) => a.levels && a.levels.find((b) => b.id === parseInt(levelId))
      );
      if (resultQuestionId) {
        setFullQuestionId(resultQuestionId.id);
        var theLevels = resultQuestionId.levels.find(
          (b) => b.id === parseInt(levelId)
        );
        setQuestions(theLevels.questions);
        setCurrentQuestionId(0);
      }
    }
    if (fullQuestionId < 0 && fullQuestions && fullQuestions.length > 0) {
      var resultQuestionId = fullQuestions.find(
        (a) => a.levels && a.levels.find((b) => b.id === parseInt(levelId))
      );
      if (resultQuestionId) {
        setFullQuestionId(resultQuestionId.id);
        var theLevels = resultQuestionId.levels.find(
          (b) => b.id === parseInt(levelId)
        );
        setQuestions(theLevels.questions);
        setCurrentQuestionId(0);
      }
    }
  }

  const selectChoice = (title2, key) => {
    setSelectedChoiceId(key);
  };

  React.useEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
    navigation.addListener("focus", (e) => {
      setCurrentQuestionId(0);
      setQuestions([]);
      setSelectedChoiceId(-1);
      setLessonComplete(false);
    });

    async function loadResourcesAndDataAsync() {
      try {
        await fetch(`${backendUrl}/view/full-question/${levelId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          method: "GET",
        }).then((response) => {
          if (!response) {
            console.log("Bad response trying to load view/full-questions/");
            return;
          }
          response.json().then((e) => setFullQuestions(e));
        });

        await fetch(`${backendUrl}/app/level-attempts/new`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          method: "POST",
          body: JSON.stringify({
            levelId: levelId,
            username: username,
          }),
        })
          .then((res) => {
            res.json().then((response) => {
              /**
               * Now upload image for the newly created id
               */
              setCurrentLevelAttemptId(response.id);
            });
          })
          .then((data) => {})
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }
    loadResourcesAndDataAsync();
    return () => {
      /**
       * Return on useEffect is similar to unmounting
       */
      setCurrentQuestionId(0);
      setQuestions(null);
      setFullQuestionId(-1);
      setSelectedChoiceId(-1);
      setLessonComplete(false);
      setLoadingComplete(false);
    };
  }, [navigation]);

  if (isLoadingComplete) {
    if (isLessonComplete) {
      return (
        <React.Fragment>
          <View style={styles(isDark, colors, showNoLives).resultScreen}>
            <View
              style={{
                flex: 1,
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {(score >= questions.length ? 1 : 0) ? (
                <React.Fragment>
                  <MonoText
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    style={{
                      textAlignVertical: "center",
                      textAlign: "center",
                      color: colors.text,
                      marginTop: 32,
                      fontWeight: "bold",
                      fontSize: 32,
                      marginBottom: 32,
                    }}
                  >
                    Congratulations!
                  </MonoText>

                  <View
                    style={{
                      maxWidth: 256,
                      maxHeight: 256,
                      width: 256,
                      height: 256,
                    }}
                  >
                    <VictoryImage />
                  </View>

                  <MonoText
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    style={{
                      textAlignVertical: "center",
                      textAlign: "center",
                      color: colors.text,
                      marginTop: 32,
                      fontWeight: "bold",
                      fontSize: 32,
                      marginBottom: 16,
                    }}
                  >
                    You scored {score}!
                  </MonoText>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <MonoText
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    style={{
                      textAlignVertical: "center",
                      textAlign: "center",
                      color: colors.text,
                      marginTop: 32,
                      fontWeight: "bold",
                      fontSize: 32,
                      marginBottom: 32,
                    }}
                  >
                    Defeat
                  </MonoText>

                  <View
                    style={{
                      maxWidth: 256,
                      maxHeight: 256,
                      width: 256,
                      height: 256,
                    }}
                  >
                    <LoseImage />
                  </View>

                  <MonoText
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    style={{
                      textAlignVertical: "center",
                      textAlign: "center",
                      color: colors.text,
                      marginTop: 32,
                      fontWeight: "bold",
                      fontSize: 32,
                      marginBottom: 16,
                    }}
                  >
                    You scored {score}!
                  </MonoText>
                </React.Fragment>
              )}
              <TouchableOpacity
                style={styles(isDark, colors, showNoLives).buttonSubmit}
                onPress={onSubmit}
              >
                <MonoText
                  style={styles(isDark, colors, showNoLives).buttonSubmitText}
                >
                  CONTINUE TO MAIN MENU
                </MonoText>
              </TouchableOpacity>
            </View>
          </View>
        </React.Fragment>
      );
    }
    if (isAnswerShown) {
      return (
        <React.Fragment>
          <View style={styleDynamic.screenBorder}>
            <View
              style={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  maxWidth: 256,
                  maxHeight: 256,
                  width: 256,
                  height: 256,
                }}
              >
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={{
                    textAlignVertical: "center",
                    textAlign: "center",
                    color: colors.text,
                  }}
                >
                  {answerPostText}
                </Text>
              </View>
              <TouchableOpacity
                style={styles(isDark, colors, showNoLives).buttonSubmit}
                onPress={onSubmit}
              >
                <MonoText
                  style={styles(isDark, colors, showNoLives).buttonSubmitText}
                >
                  CONTINUE
                </MonoText>
              </TouchableOpacity>
            </View>
          </View>
          {userDetails.hearts < 6 && <View></View>}
        </React.Fragment>
      );
    }
  }

  loadQuestions();

  if (!questions || questions.length < 1) {
    if (fullQuestionId > 0 && fullQuestions && fullQuestions.length > 0) {
      loadQuestions();
    }
    return (
      <React.Fragment>
        <View style={styleDynamic.screenBorder}>
          <Text>
            No questions available. Full question id {fullQuestionId}, and our
            level id {levelId}
          </Text>
        </View>
      </React.Fragment>
    );
  }

  if (
    !questions[currentQuestionId] ||
    questions[currentQuestionId].choices < 1
  ) {
    return (
      <React.Fragment>
        <View style={styleDynamic.screenBorder}>
          <Text>No choices available.</Text>
        </View>
      </React.Fragment>
    );
  }

  let item = chosenMarketItem;
  let red_gems = userDetails.red_gems;

  if (!item) {
    return <></>;
  }
  return (
    <React.Fragment>
      <TouchableOpacity style={styleDynamic.container} activeOpacity={1}>
        <View style={styleDynamic.nextContainer}>
          <View style={styleDynamic.screenBorder}>
            <QuestionProgressBar
              showNoLives={showNoLives}
              pressFunction={returnHome}
              points={score}
              questionsSeen={currentQuestionId}
              totalQuestionSize={questions.length}
            ></QuestionProgressBar>
            <QuestionHeader
              showNoLives={showNoLives}
              questionTitle={getQuestionTitle()}
            ></QuestionHeader>
            <QuestionMainImage
              showNoLives={showNoLives}
              imageSource={`${backendUrl}/questionsets/view-image/${questions[currentQuestionId].id}`}
            ></QuestionMainImage>
            <MonoText style={styles(isDark, colors).scoreText}>
              Score: {score}/{questions ? questions.length : "Loading..."}
            </MonoText>
            <ScrollView style={styles(isDark, colors).questionSegment}>
              {questions[currentQuestionId].choices.length === 0
                ? null
                : questions[currentQuestionId].choices.map((choiceVal, key) => {
                    return (
                      <TouchableOpacity
                        key={key}
                        style={
                          selectedChoiceId == key
                            ? styles(isDark, colors).buttonOptionSelected
                            : styles(isDark, colors).buttonOption
                        }
                        disabled={showNoLives}
                        onPress={() => selectChoice(choiceVal.title, key)}
                      >
                        <MonoText
                          style={styles(isDark, colors).buttonOptionText}
                        >
                          {choiceVal.title}
                        </MonoText>
                      </TouchableOpacity>
                    );
                  })}

              <TouchableOpacity
                style={
                  selectedChoiceId < 0
                    ? styles(isDark, colors).buttonSubmitLocked
                    : styles(isDark, colors).buttonSubmit
                }
                onPress={onSubmit}
                disabled={selectedChoiceId < 0 || showNoLives}
              >
                <MonoText
                  style={
                    selectedChoiceId < 0
                      ? styles(isDark, colors).buttonSubmitTextLocked
                      : styles(isDark, colors).buttonSubmitText
                  }
                >
                  NEXT
                </MonoText>
              </TouchableOpacity>
            </ScrollView>{" "}
            {showNoLives && (
              <React.Fragment>
                <View
                  style={[
                    {
                      flex: 1,
                      bottom: 0,
                      left: 0,
                      top: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                    },
                    {
                      flexDirection: "column",
                      position: "absolute",
                      flexGrow: 1,
                      bottom: 0,
                      justifyContent: "flex-end",
                      width: widescreen ? window.width * 0.25 : window.width,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 2 }} />
                  <View
                    style={{
                      flex: widescreen ? 2 : 3,
                      backgroundColor: isDark ? "#242424" : "white",
                      width: widescreen ? window.width * 0.25 : window.width,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flex: 1,
                          paddingTop: 12,
                          paddingLeft: 12,
                        }}
                      >
                        <RedGem inline />
                        <MonoText
                          style={{
                            color: red_gems < 1 ? "#c7c7c7" : "#fc000a",
                            position: "absolute",
                            marginLeft: 28,
                            fontSize: 18,
                            fontWeight: "bold",
                            marginTop: -2,
                          }}
                        >
                          {red_gems ? red_gems + "" : 0}
                        </MonoText>
                      </View>
                      <View
                        style={{
                          flex: 3,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MonoText
                          style={{
                            color: colors.text,
                            fontWeight: "bold",
                            fontSize: 24,
                          }}
                        >
                          You have no more lives!
                        </MonoText>
                        <MonoText style={{ color: colors.text }}>
                          Optionally buy more or quit the level.
                        </MonoText>
                      </View>
                      <View
                        style={{
                          flex: 6,
                          paddingTop: 12,
                          backgroundColor: isDark ? "#242424" : "white",
                        }}
                      >
                        {" "}
                        <TouchableOpacity
                          activeOpacity={item.locked ? 1 : 0.7}
                          disabled={item.locked}
                          onPress={(e) => {
                            if (item.locked) {
                              return false;
                            }
                            if (
                              !item.locked &&
                              buyItem(
                                userDetails,
                                myUserSettings,
                                authToken,
                                item
                              ) === true
                            ) {
                              setShowNoLives(false);
                            }
                          }}
                        >
                          <View
                            style={{
                              borderColor: "grey",
                              height: 120,
                              borderWidth: 2,
                              margin: 10,
                              marginTop: 8,
                              borderRadius: 12,
                              backgroundColor: item.locked
                                ? "rgba(0,0,0,0.2)"
                                : [],
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "row",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  maxWidth: 108,
                                }}
                              >
                                {item.component}
                              </View>
                              <View style={{ flex: 1 }}>
                                <View
                                  style={{
                                    flex: 2,
                                    paddingTop: 4,
                                  }}
                                >
                                  <MonoText
                                    style={{
                                      color: colors.text,
                                      fontSize: 18,
                                      paddingTop: 4,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item.item}
                                  </MonoText>
                                </View>
                                <View style={{ flex: 4, paddingTop: 12 }}>
                                  <MonoText style={{ color: colors.text }}>
                                    {item.description
                                      ? item.description
                                      : index}
                                  </MonoText>
                                </View>
                                <View
                                  style={{
                                    flex: 2,
                                  }}
                                >
                                  <MonoText>
                                    <View
                                      style={{ flex: 1, flexDirection: "row" }}
                                    >
                                      <RedGem inline />
                                      <MonoText
                                        style={{
                                          fontWeight: "bold",
                                          color: "#fc000a",
                                        }}
                                      >
                                        {item.cost}
                                      </MonoText>
                                    </View>
                                  </MonoText>
                                </View>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 16,
                        }}
                      >
                        <TouchableOpacity onPress={(e) => returnHome(true)}>
                          <MonoText
                            style={{
                              color: colors.text,
                              fontWeight: "bold",
                              fontSize: 24,
                            }}
                          >
                            QUIT
                          </MonoText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </React.Fragment>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}

const styles = (isDark, colors, showNoLives) =>
  StyleSheet.create({
    optionText: {
      fontSize: 15,
      alignSelf: "flex-start",
      marginTop: 1,
      color: colors.text,
    },
    resultScreen: {
      flex: 1,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "visible",
      paddingHorizontal: 16,
      backgroundColor: showNoLives
        ? isDark
          ? "rgba(28, 28, 28, 0.85)"
          : "rgba(0, 0, 0, 0.7)"
        : isDark
        ? "#353634"
        : "#e5e5e5",
    },
    buttonOption: {
      marginTop: 4,
      marginBottom: 4,
      borderWidth: "2px 2px 2px 2px",
      borderStyle: "solid",
      borderRadius: 4,
      borderColor: "yellow",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "white",
      borderStyle: "solid",
      borderColor: "#E5E5E5",
      borderBottomWidth: 3,
    },
    buttonOptionSelected: {
      marginTop: 4,
      marginBottom: 4,
      borderWidth: "2px 2px 2px 2px",
      borderStyle: "solid",
      borderRadius: 4,
      borderColor: "yellow",
      backgroundColor: "#43faf1",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "white",
      borderStyle: "solid",
      borderColor: "#35c4bd",
      borderTopWidth: 0,
      borderBottomWidth: 4,
    },
    scoreText: {
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "center",
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },
    buttonOptionText: {
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "center",
      fontSize: 15,
      padding: 6,
      fontWeight: "700",
      color: colors.text,
    },
    buttonSubmit: {
      marginTop: 4,
      marginBottom: 4,
      borderWidth: "2px 2px 2px 2px",
      borderStyle: "solid",
      borderRadius: 14,
      borderColor: "yellow",
      backgroundColor: "#3268a8",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "white",
      borderStyle: "solid",
      borderColor: "#1f4470",
      borderTopWidth: 0,
      borderBottomWidth: 4,
    },
    buttonSubmitLocked: {
      marginTop: 4,
      marginBottom: 4,
      borderWidth: "2px 2px 2px 2px",
      borderStyle: "solid",
      borderRadius: 14,
      borderColor: "yellow",
      backgroundColor: "#d1d1d1",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "white",
      borderStyle: "solid",
      borderColor: "#ababab",
      borderTopWidth: 0,
      borderBottomWidth: 4,
    },
    buttonSubmitText: {
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "center",
      fontSize: 15,
      margin: 12,
      fontWeight: "700",
      color: "#fafafa",
    },
    buttonSubmitTextLocked: {
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "center",
      fontSize: 15,
      margin: 12,
      fontWeight: "700",
      color: "#858383",
    },
    questionSegment: {
      marginBottom: 40,
      width: "100%",
      minHeight: 400,
      overflow: "scroll",
    },
  });
