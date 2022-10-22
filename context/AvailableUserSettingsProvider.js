import React, { createContext, useState, useEffect } from "react";

export const AvailableUserSettingsContext = createContext();

const AvailableUserSettingsProvider = ({ children }) => {
  const [availableSettings, setAvailableSettings] = useState([]);

  useEffect(() => {
    console.log("Available setting updated.");
  }, [availableSettings]);

  const saveAvailableSettingsMany = (article) => {
    setAvailableSettings(article);
  };

  const saveAvailableSetting = (article) => {
    const newArticle = {
      id: article.id,
      settingId: article.settingId,
      description: article.description,
      value: article.value,
    };
    var newArray = availableSettings.slice();
    newArray.push(newArticle);
    setAvailableSettings(newArray);
  };

  return (
    <AvailableUserSettingsContext.Provider
      value={{
        availableSettings,
        saveAvailableSetting,
        saveAvailableSettingsMany,
      }}
    >
      {children}
    </AvailableUserSettingsContext.Provider>
  );
};

export default AvailableUserSettingsProvider;
