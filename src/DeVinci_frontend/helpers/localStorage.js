import { store } from "../store";

let storeState;
store.subscribe((value) => storeState = value);

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
        arrayOfChats.push(storeObject.chatMessages);
        localStorage.setItem(storeType, JSON.stringify(arrayOfChats));
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

  console.log("Sync process completed, with retries scheduled for failed items.");
};

window.addEventListener('online', syncLocalChanges);

