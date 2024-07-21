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
