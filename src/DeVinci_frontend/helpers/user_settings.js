import {
  store,
  userSettings,
  temperatureDefaultSetting,
  responseLengthDefaultSetting,
  systemPromptDefaultSetting,
  saveChatsDefaultSetting
} from "../store";
import { syncLocalChanges, setUserSettingsSyncFlag } from "./local_storage";

let storeState;
store.subscribe((value) => storeState = value);

let userSettingsState;
userSettings.subscribe((value) => userSettingsState = value);

const maxTokenLongResponseLength = 1024;
const maxTokenMediumResponseLength = 256;
const maxTokenShortResponseLength = 64; 
export const maxTokenDefault = responseLengthToTokenNumber(responseLengthDefaultSetting);

const updateUserSettings = async (updatedSettingsObject) => {
  if (!storeState.isAuthed) {
    return;
  };
  try {
    // Persist to backend
    const settingsUpdatedResponse = await storeState.backendActor.update_caller_settings(updatedSettingsObject);
    // @ts-ignore
    if (settingsUpdatedResponse.Ok) {
      syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
    } else {
      // @ts-ignore
      console.error("Error updating user settings: ", settingsUpdatedResponse.Err);
      // @ts-ignore
      throw new Error("Error updating user settings: ", settingsUpdatedResponse.Err);
    };
    syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
  } catch (error) {
    // @ts-ignore
    console.error("Error updating settings: ", error);
    // Likely offline, so set flag to sync change later
    setUserSettingsSyncFlag("selectedAiModelId");
  };
};

export const updateUserSettingsProperty = async (propertyKey, propertyValue) => {
  if (!storeState.isAuthed) {
    return;
  };

  if (!propertyKey || propertyValue === null) {
    return;
  };

  let updatedSettingsObject = userSettingsState; // initiate with current settings

  // Update property
  if (propertyKey === "selectedAiModelId") {
    updatedSettingsObject.selectedAiModelId = propertyValue;
  } else if (propertyKey === "temperature") {
    updatedSettingsObject.temperature = propertyValue;
  } else if (propertyKey === "responseLength") {
    updatedSettingsObject.responseLength = propertyValue;
  } else if (propertyKey === "saveChats") {
    updatedSettingsObject.saveChats = propertyValue;
  } else if (propertyKey === "systemPrompt") {
    updatedSettingsObject.systemPrompt = propertyValue;
  };

  await updateUserSettings(updatedSettingsObject);
  return true;
};

export const resetUserSettingsPropertyToDefault = async (propertyKey) => {
  if (!storeState.isAuthed) {
    return;
  };

  if (!propertyKey) {
    return;
  };

  let updatedSettingsObject = userSettingsState; // initiate with current settings

  // Update property
  if (propertyKey === "temperature") {
    updatedSettingsObject.temperature = temperatureDefaultSetting;
  } else if (propertyKey === "responseLength") {
    updatedSettingsObject.responseLength = responseLengthDefaultSetting;
  } else if (propertyKey === "saveChats") {
    updatedSettingsObject.saveChats = saveChatsDefaultSetting;
  } else if (propertyKey === "systemPrompt") {
    updatedSettingsObject.systemPrompt = systemPromptDefaultSetting;
  };

  await updateUserSettings(updatedSettingsObject);
  return true;
};

export function responseLengthToTokenNumber(responseLength) {
  switch (responseLength) {
    case 'Long':
      return maxTokenLongResponseLength;
    case 'Medium':
      return maxTokenMediumResponseLength;
    case 'Short':
      return maxTokenShortResponseLength;
    default:
      throw new Error('Invalid response length');
  };
};

// Function to determine inference parameters based on user settings
export async function determineInferenceParameters() {
  const settings = userSettingsState;
  let temperature = settings.temperature;
  let max_tokens;
  let system_prompt = settings.systemPrompt;

  // Ensure that the temperature is within valid range
  if (!temperature || temperature < 0 || temperature > 1) {
    console.warn("Temperature setting is out of bounds. Resetting to default.");
    temperature = temperatureDefaultSetting;
  };

  // Determine the max tokens from response length
  try {
    max_tokens = responseLengthToTokenNumber(settings.responseLength);
  } catch (error) {
    console.error("Error determining max tokens:", error.message);
    // Set a default value if there's an error
    max_tokens = maxTokenDefault;  // Default if there is a problem
  };

  if (system_prompt === "") {
    system_prompt = systemPromptDefaultSetting;
  };

  return {
    temperature,
    max_tokens,
    system_prompt
  };
};

