import * as React from "react";
import { useColorScheme } from "react-native-appearance";
import { lightColors, darkColors } from "../constants/Colors.js";

export const ThemeContext = React.createContext({
  isDark: false,
  colors: lightColors,
  setScheme: () => {},
});

export const ThemeProvider = (props) => {
  /**
   * Gets the device's colour theme. Also works with web.
   *
   * Possibilities: Dark, Light, No-preference.
   */
  const colorScheme = useColorScheme();

  /*
   * To enable changing the app theme dynamically in the app (run-time)
   * we're gonna use useState so we can override the default device theme.
   */
  const [isDark, setIsDark] = React.useState(colorScheme === "dark");

  /**
   * Actively listens to changes of device's appearance.
   */
  React.useEffect(() => {
    setIsDark(colorScheme === "dark");
  }, [colorScheme]);

  const defaultTheme = {
    isDark,
    /**
     * Changes colour schemes according to theme.
     */
    colors: isDark ? darkColors : lightColors,
    /**
     * Overrides to the isDark value cause re-renders inside the context
     */
    setScheme: (scheme) => {
      setIsDark(scheme === "dark");
      return true;
    },
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to get the theme object, returning {isDark, colors, setScheme}
 * @returns the context for other components to use.
 */
export const useTheme = () => React.useContext(ThemeContext);
