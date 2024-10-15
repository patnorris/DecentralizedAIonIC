import List "mo:base/List";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Char "mo:base/Char";
import AssocList "mo:base/AssocList";
import Buffer "mo:base/Buffer";
import Random "mo:base/Random";
import RBTree "mo:base/RBTree";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";

import FileTypes "./types/FileStorageTypes";
import Utils "./Utils";

import Types "./Types";
import HTTP "./Http";

import Stoic "./EXT/Stoic";

import Protocol "./Protocol";
import Testable "mo:matchers/Testable";
import Blob "mo:base/Blob";



shared actor class DeVinciBackend(custodian: Principal) = Self {
  stable var custodians = List.make<Principal>(custodian);

// TODO: instead add functions to manage cycles balance and gather stats
  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  // https://forum.dfinity.org/t/is-there-any-address-0-equivalent-at-dfinity-motoko/5445/3
  let null_address : Principal = Principal.fromText("aaaaa-aa");

  // Helper functions
  func textToNat(txt : Text) : Nat {
    assert(txt.size() > 0);
    let chars = txt.chars();

    var num : Nat = 0;
    for (v in chars){
      let charToNum = Nat32.toNat(Char.toNat32(v)-48);
      assert(charToNum >= 0 and charToNum <= 9);
      num := num * 10 +  charToNum;          
    };

    num;
  };

  func textToNat64(txt : Text) : Nat64 {
    assert(txt.size() > 0);
    let chars = txt.chars();

    var num : Nat = 0;
    for (v in chars){
      let charToNum = Nat32.toNat(Char.toNat32(v)-48);
      assert(charToNum >= 0 and charToNum <= 9);
      num := num * 10 +  charToNum;          
    };

    Nat64.fromNat(num);
  };

// Project-specific functions
  stable var userChatsStorageStable : [(Principal, List.List<Text>)] = [];
  var userChatsStorage : HashMap.HashMap<Principal, List.List<Text>> = HashMap.HashMap(0, Principal.equal, Principal.hash);
  stable var userSettingsStorageStable : [(Principal, Types.UserSettings)] = [];
  var userSettingsStorage : HashMap.HashMap<Principal, Types.UserSettings> = HashMap.HashMap(0, Principal.equal, Principal.hash);
  stable var chatsStorageStable : [(Text, Types.Chat)] = [];
  var chatsStorage : HashMap.HashMap<Text, Types.Chat> = HashMap.HashMap(0, Text.equal, Text.hash);

  /**
   * Simple function to store a chat in the database. There are no protections so this function should only
   * be called if the caller has permissions to store the chat to the database
   *
   * @return The chat id of the stored chat
  */
  private func putChat(chat : Types.Chat) : Text {
    chatsStorage.put(chat.id, chat);
    return chat.id;
  };

  /**
   * A simple function to retrieve a chat by the chat id, this provides no protection so should only be called if
   * the caller has permissions to read the chat data
   *
   * @return The chat if it exists, otherwise null
  */
  private func getChat(chatId : Text) : ?Types.Chat {
    let result = chatsStorage.get(chatId);
    return result;
  };

  /**
   * Simple function to store a chat for the user in the database. There are no protections so this function should only
   * be called if the caller has permissions to store the chat to the database
   *
   * @return The chat id of the stored chat
  */
  private func putUserChat(user : Principal, chatId : Text) : Text {
    let userChatIds : List.List<Text> = getUserChatIds(user);
    let updatedChatIds = List.push<Text>(chatId, userChatIds);
    userChatsStorage.put(user, updatedChatIds);
    return chatId;
  };

  /**
   * A simple function to retrieve the user's chat, this provides no protection so should only be called if
   * the caller has permissions to read the chat data
   *
   * @return The user's chats if at least one exists, otherwise an empty List
  */
  private func getUserChats(user : Principal) : List.List<Types.Chat> {
    let userChatIds : List.List<Text> = getUserChatIds(user);
    var userChats : List.List<Types.Chat> = List.nil<Types.Chat>();
    for (chatId in List.toArray<Text>(userChatIds).vals()) {
      let chat = getChat(chatId);
      switch (chat) {
        case (null) {};
        case (?chat) { userChats := List.push<Types.Chat>(chat, userChats); };
      };
    };
    return userChats;
  };

  private func getUserChatIds(user : Principal) : List.List<Text> {
    let userChatIds : ?List.List<Text> = userChatsStorage.get(user);
    switch (userChatIds) {
      case (null) { return List.nil<Text>(); };
      case (?userChatIds) { return userChatIds; };
    };
  };

  private func deleteChat(chatId : Text) : Text {
    chatsStorage.delete(chatId);
    return chatId;
  };

  private func deleteUserChat(user : Principal, chatId : Text) : Text {
    let userChatIds : List.List<Text> = getUserChatIds(user);
    let updatedChatIds = List.filter(userChatIds, func(id: Text) : Bool { id != chatId });
    userChatsStorage.put(user, updatedChatIds);
    return chatId;
  };

  public shared({ caller }) func create_chat(messages : [Types.Message]) : async Types.ChatCreationResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};

    let newId : Text = await Utils.newRandomUniqueId();

    var firstMessagePreview : Text = "";
    if (messages.size() > 0) {
      firstMessagePreview := messages[0].content;
    };

    let newChat : Types.Chat = {
      id : Text = newId;
      messages : [Types.Message] = messages;
      owner : Principal = caller;
      creationTime : Nat64 = Nat64.fromNat(Int.abs(Time.now()));
      firstMessagePreview : Text = firstMessagePreview;
      chatTitle : Text = "";
    };

    let chatCreated = putChat(newChat);
    let result = putUserChat(caller, newId);

    return #Ok(result);
  };

  public shared query ({caller}) func get_caller_chats() : async Types.ChatsResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    let chats = getUserChats(caller);
    return #Ok(List.toArray(chats)); 
  };

  public shared query ({caller}) func get_caller_chat_history() : async Types.ChatsPreviewResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    let chats = getUserChats(caller);
    var chatsPreview : List.List<Types.ChatPreview> = List.nil<Types.ChatPreview>();
    chatsPreview := List.map<Types.Chat, Types.ChatPreview>(chats, func (chat : Types.Chat) : Types.ChatPreview {
      return {
        id : Text = chat.id;
        creationTime : Nat64 = chat.creationTime;
        firstMessagePreview : Text = chat.firstMessagePreview;
        chatTitle : Text = chat.chatTitle;
      };
    });
    return #Ok(List.toArray(chatsPreview)); 
  };

  public shared query ({caller}) func get_chat(chatId : Text) : async Types.ChatResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    let chat = getChat(chatId);
    switch (chat) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?chat) {
        if (caller != chat.owner) {
          return #Err(#Unauthorized);
        };
        return #Ok(chat);
      };
    };
  };

  public shared({ caller }) func update_chat_metadata(updateChatObject : Types.UpdateChatObject) : async Types.ChatIdResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    switch (getChat(updateChatObject.id)) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?chat) {
        // only owner may update
        if (chat.owner != caller) {
          return #Err(#Unauthorized);
        };

        let updatedChat : Types.Chat = {
          id = chat.id;
          messages = chat.messages;
          owner = chat.owner;
          creationTime = chat.creationTime;
          firstMessagePreview = chat.firstMessagePreview;
          chatTitle = updateChatObject.chatTitle;
        };

        let chatUpdated = putChat(updatedChat);
        return #Ok(chatUpdated);
      };
    };
  };

  public shared({ caller }) func update_chat_messages(chatId : Text, updatedMessages : [Types.Message]) : async Types.ChatIdResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    switch (getChat(chatId)) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?chat) {
        // only owner may update
        if (chat.owner != caller) {
          return #Err(#Unauthorized);
        };

        let updatedChat : Types.Chat = {
          id = chat.id;
          messages = updatedMessages;
          owner = chat.owner;
          creationTime = chat.creationTime;
          firstMessagePreview = chat.firstMessagePreview;
          chatTitle = chat.chatTitle;
        };

        let chatUpdated = putChat(updatedChat);
        return #Ok(chatUpdated);
      };
    };
  };

  public shared ({caller}) func delete_chat(chatId : Text) : async Types.ChatResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    let chat = getChat(chatId);
    switch (chat) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?chat) {
        if (caller != chat.owner) {
          return #Err(#Unauthorized);
        };
        let userChatDeletionResult = deleteUserChat(caller, chatId);
        let chatDeletionResult = deleteChat(chatId);
        return #Ok(chat);
      };
    };
  };

// User Settings

  /**
   * A simple function to retrieve the user's settings, this provides no protection so should only be called if
   * the caller has permissions to read the settings data
   *
   * @return The user's settings if they exist, otherwise an empty List
  */
  private func getUserSettings(user : Principal) : ?Types.UserSettings {
    switch (userSettingsStorage.get(user)) {
      case (null) { return null; };
      case (?userSettings) { return ?userSettings; };
    };
  };

  /**
   * Simple function to store user settings in the database. There are no protections so this function should only
   * be called if the caller has permissions to store the user settings to the database
   *
   * @return Confirmation that the user settings were stored successfully
  */
  private func putUserSettings(user : Principal, userSettings : Types.UserSettings) : Bool {
    userSettingsStorage.put(user, userSettings);
    return true;
  };

  public shared query ({caller}) func get_caller_settings() : async Types.UserSettingsResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    switch (getUserSettings(caller)) {
      case (null) {
        // No settings stored yet, return default
        let userSettings : Types.UserSettings = {
          temperature = 0.6;
          responseLength = "Long";
          saveChats = true;
          selectedAiModelId = "";
          systemPrompt = "You are a helpful, respectful and honest assistant.";
        };
        return #Ok(userSettings);
      };
      case (?userSettings) { return #Ok(userSettings); };
    };   
  };

  public shared({ caller }) func update_caller_settings(updatedSettingsObject : Types.UserSettings) : async Types.UpdateUserSettingsResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    let settingsUpdated = putUserSettings(caller, updatedSettingsObject);
    return #Ok(settingsUpdated);
  };

// Vector Database
  stable var userMemoryVectorsStorageStable : [(Principal, [Types.MemoryVector])] = [];
  var userMemoryVectorsStorage : HashMap.HashMap<Principal, [Types.MemoryVector]> = HashMap.HashMap(0, Principal.equal, Principal.hash);
  
  private func putUserMemoryVectors(user : Principal, memoryVectors : [Types.MemoryVector]) : Bool {
    userMemoryVectorsStorage.put(user, memoryVectors);
    return true;
  };

  private func getUserMemoryVectors(user : Principal) : ?[Types.MemoryVector] {
    switch (userMemoryVectorsStorage.get(user)) {
      case (null) { return null; };
      case (?memoryVectors) { return ?memoryVectors; };
    };
  };

  public shared({ caller }) func store_user_chats_memory_vectors(memoryVectors : [Types.MemoryVector]) : async Types.MemoryVectorsStoredResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};

    let result = putUserMemoryVectors(caller, memoryVectors);

    return #Ok(result);
  };

  public shared query ({caller}) func get_caller_memory_vectors() : async Types.MemoryVectorsResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    
    switch (getUserMemoryVectors(caller)) {
      case (null) { return #Err(#Unauthorized); };
      case (?memoryVectors) { return #Ok(memoryVectors); };
    };   
  };

  public shared query ({caller}) func check_caller_has_memory_vectors_entry() : async Types.MemoryVectorsCheckResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    
    switch (getUserMemoryVectors(caller)) {
      case (null) { return #Err(#Unauthorized); };
      case (?memoryVectors) { return #Ok(true); };
    };   
  };

// Email Signups from Website
  stable var emailSubscribersStorageStable : [(Text, Types.EmailSubscriber)] = [];
  var emailSubscribersStorage : HashMap.HashMap<Text, Types.EmailSubscriber> = HashMap.HashMap(0, Text.equal, Text.hash);

  // Add a user as new email subscriber
  private func putEmailSubscriber(emailSubscriber : Types.EmailSubscriber) : Text {
    emailSubscribersStorage.put(emailSubscriber.emailAddress, emailSubscriber);
    return emailSubscriber.emailAddress;
  };

  // Retrieve an email subscriber by email address
  private func getEmailSubscriber(emailAddress : Text) : ?Types.EmailSubscriber {
    let result = emailSubscribersStorage.get(emailAddress);
    return result;
  };

  // User can submit a form to sign up for email updates
    // For now, we only capture the email address provided by the user and on which page they submitted the form
  public func submit_signup_form(submittedSignUpForm : Types.SignUpFormInput) : async Text {
    switch(getEmailSubscriber(submittedSignUpForm.emailAddress)) {
      case null {
        // New subscriber
        let emailSubscriber : Types.EmailSubscriber = {
          emailAddress: Text = submittedSignUpForm.emailAddress;
          pageSubmittedFrom: Text = submittedSignUpForm.pageSubmittedFrom;
          subscribedAt: Nat64 = Nat64.fromNat(Int.abs(Time.now()));
        };
        let result = putEmailSubscriber(emailSubscriber);
        if (result != emailSubscriber.emailAddress) {
          return "There was an error signing up. Please try again.";
        };
        return "Successfully signed up!";
      };
      case _ { return "Already signed up!"; };
    };  
  };

  // Function for custodian to get all email subscribers
  public shared query ({ caller }) func get_email_subscribers() : async [(Text, Types.EmailSubscriber)] {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return [];
		};
    // Only Principals registered as custodians can access this function
    if (List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })) {
      return Iter.toArray(emailSubscribersStorage.entries());
    };
    return [];
  };

  // Function for custodian to delete an email subscriber
  public shared({ caller }) func delete_email_subscriber(emailAddress : Text) : async Bool {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return false;
		};
    // Only Principals registered as custodians can access this function
    if (List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })) {
      emailSubscribersStorage.delete(emailAddress);
      return true;
    };
    return false;
  };

// HTTP interface
  /* public query func http_request(request : HTTP.Request) : async HTTP.Response {
    //Debug.print(debug_show("http_request test"));
    //Debug.print(debug_show(request));
    if (Text.contains(request.url, #text("tokenid"))) { // endpoint for Stoic Wallet/Entrepot
      let tokenId = Iter.toArray(Text.tokens(request.url, #text("tokenid=")))[1];
      let { index } = Stoic.decodeToken(tokenId);
      let item = List.get(nfts, Nat32.toNat(index));
      switch (item) {
        case (null) {
          let response = {
            body = Text.encodeUtf8("Invalid tokenid");
            headers = [];
            status_code = 404 : Nat16;
            streaming_strategy = null;
            upgrade = false;
          };
          return(response);
        };
        case (?token) {
          let body = token.metadata[0].data;
          let response = {
            body = body;
            headers = [("Content-Type", "text/html"), ("Content-Length", Nat.toText(body.size()))];
            status_code = 200 : Nat16;
            streaming_strategy = null;
            upgrade = false;
          };
          return(response);
        };
      };
    } else if (Text.contains(request.url, #text("spaceId"))) {
      let spaceId = Iter.toArray(Text.tokens(request.url, #text("spaceId=")))[1];
      let item = List.get(nfts, textToNat(spaceId));
      switch (item) {
        case (null) {
          let response = {
            body = Text.encodeUtf8("Invalid spaceId");
            headers = [];
            status_code = 404 : Nat16;
            streaming_strategy = null;
            upgrade = false;
          };
          return(response);
        };
        case (?token) {
          let body = token.metadata[0].data;
          let response = {
            body = body;
            headers = [("Content-Type", "text/html"), ("Content-Length", Nat.toText(body.size()))];
            status_code = 200 : Nat16;
            streaming_strategy = null;
            upgrade = false;
          };
          return(response);
        };
      };
    } else {
      return {
        upgrade = false; // ← If this is set to true, the request will be sent to http_request_update()
        status_code = 200;
        headers = [ ("content-type", "text/plain") ];
        body = "It does not work";
        streaming_strategy = null;
      };
    };
  }; */

// Upgrade Hooks
  system func preupgrade() {
    userChatsStorageStable := Iter.toArray(userChatsStorage.entries());
    userSettingsStorageStable := Iter.toArray(userSettingsStorage.entries());
    chatsStorageStable := Iter.toArray(chatsStorage.entries());
    emailSubscribersStorageStable := Iter.toArray(emailSubscribersStorage.entries());
    userMemoryVectorsStorageStable := Iter.toArray(userMemoryVectorsStorage.entries());
  };

  system func postupgrade() {
    userChatsStorage := HashMap.fromIter(Iter.fromArray(userChatsStorageStable), userChatsStorageStable.size(), Principal.equal, Principal.hash);
    userChatsStorageStable := [];
    userSettingsStorage := HashMap.fromIter(Iter.fromArray(userSettingsStorageStable), userSettingsStorageStable.size(), Principal.equal, Principal.hash);
    userSettingsStorageStable := [];    
    chatsStorage := HashMap.fromIter(Iter.fromArray(chatsStorageStable), chatsStorageStable.size(), Text.equal, Text.hash);
    chatsStorageStable := [];
    emailSubscribersStorage := HashMap.fromIter(Iter.fromArray(emailSubscribersStorageStable), emailSubscribersStorageStable.size(), Text.equal, Text.hash);
    emailSubscribersStorageStable := [];
    userMemoryVectorsStorage := HashMap.fromIter(Iter.fromArray(userMemoryVectorsStorageStable), userMemoryVectorsStorageStable.size(), Principal.equal, Principal.hash);
    userMemoryVectorsStorageStable := [];
  };
};
