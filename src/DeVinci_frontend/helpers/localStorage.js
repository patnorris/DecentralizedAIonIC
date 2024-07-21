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
  if (chatHistory) {
    localStorage.setItem("chatHistoryStoredLocally", JSON.stringify(chatHistory));
  } else {
    return false;
  };
  return true;
};

export function getLocallyStoredChatHistory(chatId) {
  const chatHistory = localStorage.getItem("chatHistoryStoredLocally");
  if (chatHistory) {
    return JSON.parse(chatHistory);
  };
  return null;
};
