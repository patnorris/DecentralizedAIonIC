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
