import React, { createContext, useState, useEffect } from "react";

export const GlobalSettingsContext = createContext();

const GlobalSettingsProvider = ({ children }) => {
  const [globalSettings, setGlobalSettings] = useState([]);

  useEffect(() => {
    console.log("Global setting updated.");
  }, [globalSettings]);

  const saveGlobalSettingsMany = (article) => {
    setGlobalSettings(article);
  };

  const saveGlobalSetting = (article) => {
    const newArticle = {
      id: article.id,
      settingId: article.settingId,
      description: article.description,
      value: article.value,
    };
    var newArray = globalSettings.slice();
    newArray.push(newArticle);
    setGlobalSettings(newArray);
  };

  return (
    <GlobalSettingsContext.Provider
      value={{ globalSettings, saveGlobalSetting, saveGlobalSettingsMany }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export default GlobalSettingsProvider;
