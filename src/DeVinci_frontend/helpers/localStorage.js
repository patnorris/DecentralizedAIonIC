import { store } from "../store";

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
      console.log("in setLocalFlag arrayOfModels ", arrayOfModels);
    } else {
      let newArrayForModel = [flagObject.modelId];
      localStorage.setItem(flagType, JSON.stringify(newArrayForModel));
    };
  } else {
    return false;
  };
  return true;
};

export function getLocalFlag(flagType) {
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
  console.log("in storeChatHistoryLocally chatHistory ", chatHistory);
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
  console.log("in getLocallyStoredChatHistory ");
  const chatHistory = localStorage.getItem("chatHistoryStoredLocally");
  console.log("in getLocallyStoredChatHistory chatHistory ", chatHistory);
  if (chatHistory) {
    return JSON.parse(chatHistory);
  };
  return null;
};

export function storeLocalChangeToBeSynced(storeType, storeObject) {
  console.log("in storeLocalChangeToBeSynced storeType ", storeType);
  console.log("in storeLocalChangeToBeSynced storeObject ", storeObject);
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
    } else if (storeType === "newLocalChatToSync") {
      let newChatsToSync = localStorage.getItem(storeType);
      // newChatsToSync is a stringified array where each entry is a new chat to sync (as array of messages)
      if (newChatsToSync) {
        let arrayOfChats = JSON.parse(newChatsToSync);
        // We need to check whether this chat is already included in the ones to sync (to avoid duplicates)
        // Check if the current storeObject's first message content already exists in any stored chats
        const existingChatIndex = arrayOfChats.findIndex(chat => 
          chat.length > 0 && chat[0].content === storeObject.chatMessages[0].content
        );
        if (existingChatIndex !== -1) {
          // If the chat exists, replace it with the new chatMessages
          arrayOfChats[existingChatIndex] = storeObject.chatMessages;
        } else {
          // If the chat does not exist, add the new chatMessages to the array
          arrayOfChats.push(storeObject.chatMessages);
        };
        localStorage.setItem(storeType, JSON.stringify(arrayOfChats));
        console.log("in storeLocalChangeToBeSynced arrayOfChats ", arrayOfChats);
      } else {
        let newArrayForChats = [storeObject.chatMessages];
        localStorage.setItem(storeType, JSON.stringify(newArrayForChats));
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
  console.log("in setUserSettingsSyncFlag storeType ", flagType);
  if (flagType === "selectedAiModelId") {
    localStorage.setItem("selectedAiModelIdNeedsSync", "true");
    return true;
  } else {
    return false;
  };
};

export function removeLocalChangeToBeSynced(storeType, storeObject) {
  console.log("in removeLocalChangeToBeSynced storeType ", storeType);
  console.log("in removeLocalChangeToBeSynced storeObject ", storeObject);
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
    } else if (storeType === "newLocalChatToSync") {
      let newChatsToSync = localStorage.getItem(storeType);
      // newChatsToSync is a stringified array where each entry is a new chat to sync (as array of messages)
      if (newChatsToSync) {
        let arrayOfChats = JSON.parse(newChatsToSync);
        // We need to check whether this chat is already included in the ones to sync (to avoid duplicates)
        // Remove if the current storeObject's first message content already exists in any stored chats
        const existingChatIndex = arrayOfChats.findIndex(chat => 
          chat.length > 0 && chat[0].content === storeObject.chatMessages[0].content
        );
        if (existingChatIndex !== -1) {
          // If the chat exists, remove it
          arrayOfChats.splice(existingChatIndex, 1);
        };
        localStorage.setItem(storeType, JSON.stringify(arrayOfChats));
        console.log("in removeLocalChangeToBeSynced arrayOfChats ", arrayOfChats);
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
  console.log("in syncLocalChanges navigator.onLine ", navigator.onLine);
  if (!navigator.onLine) {
    return;
  };
  
  const chatsToSyncStored = localStorage.getItem('localChatMessagesToSync');
  console.log("in syncLocalChanges chatsToSyncStored ", chatsToSyncStored);
  let chatsToUpdate = chatsToSyncStored ? JSON.parse(chatsToSyncStored) : {};
  console.log("in syncLocalChanges chatsToUpdate ", chatsToUpdate);

  const newChatsToSync = localStorage.getItem('newLocalChatToSync');
  console.log("in syncLocalChanges newChatsToSync ", newChatsToSync);
  let chatsToCreate = newChatsToSync ? JSON.parse(newChatsToSync) : [];
  console.log("in syncLocalChanges chatsToCreate ", chatsToCreate);

  // Temporary storage to handle failures
  let failedUpdates = {};
  let failedCreations = [];

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
  for (const chatMessages of chatsToCreate) {
    try {
      const chatCreatedResponse = await storeState.backendActor.create_chat(chatMessages);
      if (chatCreatedResponse.Err) {
        console.error("Error message syncing new chat: ", chatCreatedResponse.Err);
        // Store failed creations to retry later
        failedCreations.push(chatMessages);
      };
    } catch (error) {
      console.error("Failed to create new chat due to an error: ", error);
      // Store failed creations to retry later
      failedCreations.push(chatMessages);
    };
  };

  // Update localStorage with failed items only
  console.log("in syncLocalChanges failedUpdates ", failedUpdates);
  if (Object.keys(failedUpdates).length > 0) {
    localStorage.setItem('localChatMessagesToSync', JSON.stringify(failedUpdates));
  } else {
    localStorage.removeItem('localChatMessagesToSync');
  };
  console.log("in syncLocalChanges failedCreations ", failedCreations);
  if (failedCreations.length > 0) {
    localStorage.setItem('newLocalChatToSync', JSON.stringify(failedCreations));
  } else {
    localStorage.removeItem('newLocalChatToSync');
  };

  // Sync user settings changes
  const aiModelFlagToSyncStored = localStorage.getItem("selectedAiModelIdNeedsSync");
  if (aiModelFlagToSyncStored === "true") {
    const selectedAiModelIdToSync = localStorage.getItem("selectedAiModelId");
    if (selectedAiModelIdToSync) {
      const updatedSettingsObject = {
        selectedAiModelId: selectedAiModelIdToSync,
      };
      try {
        const settingsUpdatedResponse = await storeState.backendActor.update_caller_settings(updatedSettingsObject);            
        // @ts-ignore
        if (settingsUpdatedResponse.Err) {
          // @ts-ignore
          console.error("Error syncing user settings: ", settingsUpdatedResponse.Err);
          // @ts-ignore
          throw new Error("Error syncing user settings: ", settingsUpdatedResponse.Err);
        } else {
          localStorage.setItem("selectedAiModelIdNeedsSync", "false"); // sync successful
        };
      } catch (error) {
        // @ts-ignore
        console.error("Error syncing settings: ", error);
        // Set flag to sync change later
        setUserSettingsSyncFlag("selectedAiModelId");
      };
    } else {
      // no AI model id to sync, so no sync necessary
      localStorage.setItem("selectedAiModelIdNeedsSync", "false");
    };    
  };

  console.log("Sync process completed, with retries scheduled for failed items.");
  return true;
};

