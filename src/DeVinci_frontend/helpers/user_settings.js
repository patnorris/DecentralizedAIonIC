import {
  store,
  userSettings
} from "../store";
import { syncLocalChanges, setUserSettingsSyncFlag } from "./local_storage";

let storeState;
store.subscribe((value) => storeState = value);

let userSettingsState;
userSettings.subscribe((value) => userSettingsState = value);

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

  if (!propertyKey || !propertyValue) {
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
  };

  await updateUserSettings(updatedSettingsObject);
  return true;
};

export function responseLengthToTokenNumber(responseLength) {
  switch (responseLength) {
    case 'Long':
      return 512;
    case 'Medium':
      return 128;
    case 'Short':
      return 32;
    default:
      throw new Error('Invalid response length');
  };
};

// Function to determine inference parameters based on user settings
export async function determineInferenceParameters() {
  const settings = userSettingsState;
  let temperature = settings.temperature;
  let max_tokens;

  // Ensure that the temperature is within valid range
  if (!temperature || temperature < 0 || temperature > 1) {
    console.warn("Temperature setting is out of bounds. Resetting to default (0.6).");
    temperature = 0.6;
  };

  // Determine the max tokens from response length
  try {
    max_tokens = responseLengthToTokenNumber(settings.responseLength);
  } catch (error) {
    console.error("Error determining max tokens:", error.message);
    // Set a default value if there's an error
    max_tokens = 128;  // Default to 'Medium' if there is a problem
  };

  return {
    temperature,
    max_tokens
  };
};

