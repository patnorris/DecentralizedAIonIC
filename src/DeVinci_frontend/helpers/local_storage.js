import {
  store,
  saveChatsUserSelection,
  downloadedModels 
} from "../store";

let storeState;
store.subscribe((value) => storeState = value);

export function setLocalFlag(flagType, flagObject) {
  if (flagType === "downloadedAiModels") {
    const modelFlagsStored = localStorage.getItem(flagType);
    // modelFlagsStored is a stringified array where each entry is a model id (of a model that has been downloaded)
    if (modelFlagsStored) {
      let arrayOfModels = JSON.parse(modelFlagsStored);
      // Check if the model already exists in the array
      const existingModelIndex = arrayOfModels.findIndex(modelId => 
        modelId === flagObject.modelId
      );
      if (existingModelIndex === -1) {
        // If the model does not exist, add its id to the array
        arrayOfModels.push(flagObject.modelId);
      };
      localStorage.setItem(flagType, JSON.stringify(arrayOfModels));
      // Update the downloadedModels store
      downloadedModels.set(arrayOfModels);
    } else {
      let newArrayForModel = [flagObject.modelId];
      localStorage.setItem(flagType, JSON.stringify(newArrayForModel));
      // Update the downloadedModels store
      downloadedModels.set(newArrayForModel);
    };
  } else if (flagType === "aiModelDownloadingProgress") {
    const modelDownloadProgressStored = localStorage.getItem(flagType);
    // modelDownloadProgressStored is a stringified object where each key is a model id and the value the download progress
    if (modelDownloadProgressStored) {
      let modelsObject = JSON.parse(modelDownloadProgressStored);
      modelsObject[flagObject.modelId] = flagObject.downloadProgress;
      localStorage.setItem(flagType, JSON.stringify(modelsObject));
    } else {
      // First entry
      let modelsObject = {};
      modelsObject[flagObject.modelId] = flagObject.downloadProgress;
      localStorage.setItem(flagType, JSON.stringify(modelsObject));      
    };
  } else if (flagType === "saveChatsUserSelection") {
    // Flag to indicate whether the user selected to store the chats or not
    if (flagObject.saveChats !== null) {
      saveChatsUserSelection.set(flagObject.saveChats); // automatically updates localStorage flag
    } else {
      return false;          
    };
  } else {
    return false;
  };
  return true;
};

// Export addDownloadedModel as part of setLocalFlag
export function addDownloadedModel(modelId) {
  return setLocalFlag("downloadedAiModels", { modelId });
};

export function getLocalFlag(flagType, flagObject=null) {
  if (flagType === "downloadedAiModels") {
    const modelFlagsStored = localStorage.getItem(flagType);
    // modelFlagsStored is a stringified array where each entry is a model id (of a model that has been downloaded)
    if (modelFlagsStored) {
      let arrayOfModels = JSON.parse(modelFlagsStored);
      if (arrayOfModels) {
        return arrayOfModels;
      } else {
        return [];
      };
    } else {
      return [];
    };
  } else if (flagType === "aiModelDownloadingProgress") {
    const modelDownloadProgressStored = localStorage.getItem(flagType);
    // modelDownloadProgressStored is a stringified object where each key is a model id and the value the download progress
    if (modelDownloadProgressStored) {
      let modelsObject = JSON.parse(modelDownloadProgressStored);
      if (modelsObject && modelsObject[flagObject.modelId]) {
        return modelsObject[flagObject.modelId];
      } else {
        return 0;
      };
    } else {
      return 0;
    };
  } else if (flagType === "saveChatsUserSelection") {
    // Flag to indicate whether the user selected to store the chats or not
    const saveChatsFlag = localStorage.getItem(flagType); // flag value is a stringified Bool
    if (saveChatsFlag === "false") {
      return false;
    } else {
      return true;
    };
  } else {
    return null;
  };
};

export function userHasDownloadedModel() {
  const modelFlagsStored = localStorage.getItem("downloadedAiModels");
  // modelFlagsStored is a stringified array where each entry is a model id (of a model that has been downloaded)
  if (modelFlagsStored) {
    let arrayOfModels = JSON.parse(modelFlagsStored);
    if (arrayOfModels && arrayOfModels.length > 0) {
      return true;
    } else {
      return false;
    };
  } else {
    return false;
  };
};

export function storeChatLocally(chatId, chatMessages) {
  const chatsStored = localStorage.getItem("chatsStoredLocally");
  // chatsStored is a stringified dictionary where the chatId is the key and the chat's messages (as array) the value
  if (chatsStored) {
    let dictionaryForChats = JSON.parse(chatsStored);
    dictionaryForChats[chatId] = chatMessages;
    localStorage.setItem("chatsStoredLocally", JSON.stringify(dictionaryForChats));
  } else {
    let newDictionaryForChats = {};
    newDictionaryForChats[chatId] = chatMessages;
    localStorage.setItem("chatsStoredLocally", JSON.stringify(newDictionaryForChats));
  };
  return true;
};

export function getLocallyStoredChat(chatId) {
  const chatsStored = localStorage.getItem("chatsStoredLocally");
  // chatsStored is a stringified dictionary where the chatId is the key and the chat's messages (as array) the value
  if (chatsStored) {
    let dictionaryForChats = JSON.parse(chatsStored);
    return dictionaryForChats[chatId];
  };
  return null;
};

export function storeChatHistoryLocally(chatHistory) {
  if (chatHistory) {
    function bigIntReplacer(_key, value) {
      return typeof value === 'bigint' ? value.toString() : value;
    };
    localStorage.setItem("chatHistoryStoredLocally", JSON.stringify(chatHistory, bigIntReplacer));
  } else {
    return false;
  };
  return true;
};

export function getLocallyStoredChatHistory() {
  const chatHistory = localStorage.getItem("chatHistoryStoredLocally");
  if (chatHistory) {
    return JSON.parse(chatHistory);
  };
  return null;
};

export function storeLocalChangeToBeSynced(storeType, storeObject) {
  if (storeObject) {
    if (storeType === "localChatMessagesToSync") {
      const chatsToSyncStored = localStorage.getItem(storeType);
      // chatsToSyncStored is a stringified dictionary where the chatId is the key and the chat's messages to sync (as array) the value
      if (chatsToSyncStored) {
        let dictionaryForChats = JSON.parse(chatsToSyncStored);
        dictionaryForChats[storeObject.chatId] = storeObject.chatMessages;
        localStorage.setItem(storeType, JSON.stringify(dictionaryForChats));
      } else {
        let newDictionaryForChats = {};
        newDictionaryForChats[storeObject.chatId] = storeObject.chatMessages;
        localStorage.setItem(storeType, JSON.stringify(newDictionaryForChats));
      };
      return true;
    } else if (storeType === "newLocalChatToSync") { // TODO: verify new functionality
      console.log("storeLocalChangeToBeSynced storeType ", storeType);
      console.log("storeLocalChangeToBeSynced storeObject ", storeObject);
      let newChatsToSync = localStorage.getItem(storeType); // newChatsToSync is a stringified object where each entry is a new chat to sync (key: local id, value: messages)
      console.log("storeLocalChangeToBeSynced newChatsToSync ", newChatsToSync);
      if (newChatsToSync) {
        let chatsDictionary = JSON.parse(newChatsToSync);
        console.log("storeLocalChangeToBeSynced chatsDictionary ", chatsDictionary);
        chatsDictionary[storeObject.newLocalChatId] = storeObject.chatMessages; // upserts chat
        console.log("storeLocalChangeToBeSynced chatsDictionary updated ", chatsDictionary);
        localStorage.setItem(storeType, JSON.stringify(chatsDictionary));
        console.log("storeLocalChangeToBeSynced update localStorage ", localStorage.getItem(storeType));
      } else {
        let newchatsDictionary = {};
        console.log("storeLocalChangeToBeSynced newchatsDictionary ", newchatsDictionary);
        newchatsDictionary[storeObject.newLocalChatId] = storeObject.chatMessages;
        console.log("storeLocalChangeToBeSynced newchatsDictionary updated ", newchatsDictionary);
        localStorage.setItem(storeType, JSON.stringify(newchatsDictionary));
        console.log("storeLocalChangeToBeSynced update localStorage ", localStorage.getItem(storeType));
      };
      return true;
    } else {
      return false;
    };
  } else {
    return false;
  };
};

export function setUserSettingsSyncFlag(flagType) {
  if (flagType === "userSettings") {
    localStorage.setItem("userSettingsNeedsSync", "true");
    return true;
  } else if (flagType === "selectedAiModelId") {
    localStorage.setItem("selectedAiModelIdNeedsSync", "true");
    return true;
  } else {
    return false;
  };
};

export function removeLocalChangeToBeSynced(storeType, storeObject) {
  if (storeObject) {
    if (storeType === "localChatMessagesToSync") {
      const chatsToSyncStored = localStorage.getItem(storeType);
      // chatsToSyncStored is a stringified dictionary where the chatId is the key and the chat's messages to sync (as array) the value
      if (chatsToSyncStored) {
        let dictionaryForChats = JSON.parse(chatsToSyncStored);
        delete dictionaryForChats[storeObject.chatId];
        localStorage.setItem(storeType, JSON.stringify(dictionaryForChats));
      };
      return true;
    } else if (storeType === "newLocalChatToSync") { // TODO: check new functionality
      let newChatsToSync = localStorage.getItem(storeType); // newChatsToSync is a stringified object where each entry is a new chat to sync (key: local id, value: messages)
      if (newChatsToSync) {
        let chatsDictionary = JSON.parse(newChatsToSync);
        console.log("removeLocalChangeToBeSynced chatsDictionary ", chatsDictionary);
        delete chatsDictionary[storeObject.newLocalChatId];
        console.log("removeLocalChangeToBeSynced chatsDictionary updated ", chatsDictionary);
        localStorage.setItem(storeType, JSON.stringify(chatsDictionary));
        console.log("removeLocalChangeToBeSynced update localStorage ", localStorage.getItem(storeType));
      };
      return true;
    } else {
      return false;
    };
  } else {
    return false;
  };
};

export async function syncLocalChanges() {
  if (!navigator.onLine) {
    return;
  };
  
  const chatsToSyncStored = localStorage.getItem('localChatMessagesToSync');
  let chatsToUpdate = chatsToSyncStored ? JSON.parse(chatsToSyncStored) : {};

  const newChatsToSync = localStorage.getItem('newLocalChatToSync'); // TODO: check new functionality
  let chatsToCreate = newChatsToSync ? JSON.parse(newChatsToSync) : {};

  // Temporary storage to handle failures
  let failedUpdates = {};
  let failedCreations = {};

  console.info("syncing local changes to the backend");
  // Sync existing chats
  for (const chatId in chatsToUpdate) {
    const messagesFormattedForBackend = chatsToUpdate[chatId];  // Assuming these are already formatted properly
    try {
      const chatUpdatedResponse = await storeState.backendActor.update_chat_messages(chatId, messagesFormattedForBackend);
      if (chatUpdatedResponse.Err) {
        console.error("Error message syncing chat messages: ", chatUpdatedResponse.Err);
        // Store failed updates to retry later
        failedUpdates[chatId] = messagesFormattedForBackend;
      };
    } catch (error) {
      console.error("Failed to sync chat updates due to an error: ", error);
      // Store failed updates to retry later
      failedUpdates[chatId] = messagesFormattedForBackend;
    };
  };

  // Sync new chats
  for (const newLocalChatId in chatsToCreate) { // TODO: verify chatMessages is in correct format for backend call
    const messagesFormattedForBackend = chatsToCreate[newLocalChatId];
    console.log("Sync new chats chatMessages ", messagesFormattedForBackend);
    try {
      const chatCreatedResponse = await storeState.backendActor.create_chat(messagesFormattedForBackend);
      if (chatCreatedResponse.Err) {
        console.error("Error message syncing new chat: ", chatCreatedResponse.Err);
        // Store failed creations to retry later
        failedCreations[newLocalChatId] = messagesFormattedForBackend;
      };
    } catch (error) {
      console.error("Failed to create new chat due to an error: ", error);
      // Store failed creations to retry later
      failedCreations[newLocalChatId] = messagesFormattedForBackend;
    };
  };

  // Update localStorage with failed items only
  if (Object.keys(failedUpdates).length > 0) {
    localStorage.setItem('localChatMessagesToSync', JSON.stringify(failedUpdates));
  } else {
    localStorage.removeItem('localChatMessagesToSync');
  };
  if (Object.keys(failedCreations).length > 0) {
    localStorage.setItem('newLocalChatToSync', JSON.stringify(failedCreations));
  } else {
    localStorage.removeItem('newLocalChatToSync');
  };

  // Sync user settings changes
  const userSettingsFlagToSyncStored = localStorage.getItem("userSettingsNeedsSync");
  if (userSettingsFlagToSyncStored === "true") {
    const userSettingsToSync = localStorage.getItem("userSettings");
    if (userSettingsToSync) {
      try {
        const updatedSettingsObject = JSON.parse(userSettingsToSync);
        const settingsUpdatedResponse = await storeState.backendActor.update_caller_settings(updatedSettingsObject);            
        // @ts-ignore
        if (settingsUpdatedResponse.Err) {
          // @ts-ignore
          console.error("Error syncing user settings: ", settingsUpdatedResponse.Err);
          // @ts-ignore
          throw new Error("Error syncing user settings: ", settingsUpdatedResponse.Err);
        } else {
          localStorage.setItem("userSettingsNeedsSync", "false"); // sync successful
        };
      } catch (error) {
        // @ts-ignore
        console.error("Error syncing settings: ", error);
        // Set flag to sync change later
        setUserSettingsSyncFlag("userSettings");
      };
    } else {
      // no user settings to sync, so no sync necessary
      localStorage.setItem("userSettingsNeedsSync", "false");
    };    
  };

  console.info("Sync process completed, with retries scheduled for failed items.");
  return true;
};