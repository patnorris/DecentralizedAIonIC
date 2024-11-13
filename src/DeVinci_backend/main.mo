import List "mo:base/List";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";

import Utils "./Utils";

import Types "./Types";

shared actor class DeVinciBackend(custodian: Principal) = Self {
  stable var custodians = List.make<Principal>(custodian);

  stable var canisterIsPrivate : Bool = false; // variable to indicate whether this is the shared DeVinci backend (false) or a user's own backend (true)

  public shared({ caller }) func updateCanisterIsPrivate(newIsPrivateValue : Bool) : async Bool {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return false;
		};
    if (not Principal.isController(caller)) {
      return false;
    };
    canisterIsPrivate := newIsPrivateValue;
    return true;
  };

  stable var CANISTER_CREATION_CANISTER_ID : Text = ""; // local dev: "bkyz2-fmaaa-aaaaa-qaaaq-cai";

  public shared (msg) func setCanisterCreationCanisterId(_canister_creation_canister_id : Text) : async Types.AuthRecordResult {
    if (not Principal.isController(msg.caller)) {
      return #Err(#Unauthorized);
    };
    CANISTER_CREATION_CANISTER_ID := _canister_creation_canister_id;
    let authRecord = { auth = "You set the creation canister for this canister." };
    return #Ok(authRecord);
  };

// TODO: instead add functions to manage cycles balance and gather stats
  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  // https://forum.dfinity.org/t/is-there-any-address-0-equivalent-at-dfinity-motoko/5445/3
  let null_address : Principal = Principal.fromText("aaaaa-aa");

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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
      return #Err(#Unauthorized);
    };
    switch (getUserSettings(caller)) {
      case (null) {
        // No settings stored yet, return default
        let userSettings : Types.UserSettings = {
          temperature = 0.6;
          responseLength = "Medium";
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
      return #Err(#Unauthorized);
    };
    
    switch (getUserMemoryVectors(caller)) {
      case (null) { return #Err(#Unauthorized); };
      case (?memoryVectors) { return #Ok(true); };
    };   
  };

// Knowledgebase
  //let knowledgebaseCanisterId : Text = "bkyz2-fmaaa-aaaaa-qaaaq-cai"; // for local dev
  let knowledgebaseCanisterId : Text = "44ti7-fiaaa-aaaak-qitia-cai"; // for development, TODO: dynamically chose correct address for stage/local dev 
  type VecDoc = { content : Text; embeddings : Types.Embeddings };
  type VecQuery = { #Embeddings : Types.Embeddings };
  type PlainDoc = { content : Text };

  public shared({ caller }) func add_to_user_knowledgebase(content: Text, embeddings: Types.Embeddings) : async Types.MemoryVectorsStoredResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    if (canisterIsPrivate and not Principal.isController(caller)) {
      return #Err(#Unauthorized);
    };
    
    let knowledgebaseCanister = actor(knowledgebaseCanisterId): actor { add: (VecDoc) -> async Text };
    let result = await knowledgebaseCanister.add({content=content ; embeddings=embeddings});

    return #Ok(true);
  };

  public shared ({caller}) func search_user_knowledgebase(embeddings: Types.Embeddings) : async Types.SearchKnowledgeBaseResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    if (canisterIsPrivate and not Principal.isController(caller)) {
      return #Err(#Unauthorized);
    };

    //search(vec_query: VecQuery, k: usize) -> Option<Vec<PlainDoc>>
    let knowledgebaseCanister = actor(knowledgebaseCanisterId): actor { search: (VecQuery, Nat64) -> async ?[PlainDoc] };
    let result = await knowledgebaseCanister.search(#Embeddings(embeddings), 1);
    switch (result) {
      case (null) { return #Err(#Other("none found")); };
      case (?resultDocs) {
        if (resultDocs.size() > 0) {
          return #Ok(resultDocs[0].content);
        };
        return #Err(#Other("none found"));
      };
    };   
  };

// User created canisters
  let canisterCreationCanister = actor (CANISTER_CREATION_CANISTER_ID) : actor {
      amiController() : async Types.AuthRecordResult;
      createCanister : (configurationInput : Types.CanisterCreationConfiguration) -> async Types.CanisterCreationResult;
  };

  // Map each user Principal to a record with the info about the created canisters
  private var createdCanistersByUser = HashMap.HashMap<Principal, [Types.UserCanisterEntry]>(0, Principal.equal, Principal.hash);
  stable var createdCanistersByUserStable : [(Principal, [Types.UserCanisterEntry])] = [];

  private var usersWithOwnBackendCanister = HashMap.HashMap<Principal, Text>(0, Principal.equal, Principal.hash);
  stable var usersWithOwnBackendCanisterStable : [(Principal, Text)] = [];

  public query (msg) func whoami() : async Principal {
    return msg.caller;
  };

  public query ({caller}) func amiController() : async Types.AuthRecordResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    if (not Principal.isController(caller)) {
      return #Err(#Unauthorized);
    };
    let authRecord = { auth = "You are a controller of this canister." };
    return #Ok(authRecord);
  };

  // Admin function to verify that this canister is a controller of canisterCreationCanister
  public shared ({caller}) func isControllerLogicOk() : async Types.AuthRecordResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};
    if (not Principal.isController(caller)) {
      return #Err(#Unauthorized);
    };
    try {
      let authRecordResultCanister : Types.AuthRecordResult = await canisterCreationCanister.amiController();
      switch (authRecordResultCanister) {
          case (#Err(authErrorCanister)) { return authRecordResultCanister; };
          case (#Ok(authSuccessCanister)) {
            return authRecordResultCanister;
          };
      };
    } catch (error : Error) {
      // Handle any other errors
      return #Err(#Other("Failed to retrieve controller info"));
    };
  };

  private func verifyUserRequest(user : Principal, canisterType : Types.CanisterType) : Bool {
    switch(canisterType) {
      case (#Knowledgebase) {
        // Verify that the user hasn't created any canisters yet (only one canister pair per user is allowed)
        switch(createdCanistersByUser.get(user)) {
          case (?existingUserEntries) {
            for (userEntry in existingUserEntries.vals()) {
              if (userEntry.userCanister.canisterType == canisterType) {
                return false; // only one entry per user
              };
            };
            return true;
          };
          case _ { return true; }; // no entry yet
        };
      };
      case (#Backend) {
        // Verify that the user hasn't created any canisters yet (only one canister pair per user is allowed)
        switch(createdCanistersByUser.get(user)) {
          case (?existingUserEntries) {
            for (userEntry in existingUserEntries.vals()) {
              if (userEntry.userCanister.canisterType == canisterType) {
                return false; // only one entry per user
              };
            };
            return true;
          };
          case _ { return true; }; // no entry yet
        };
      };
      case _ { return false; }; // Invalid request
    };
  };

  private func getCanisterInfo(user : Principal, canisterType : Types.CanisterType) : ?Types.CanisterInfo {
    switch(canisterType) {
      case (#Knowledgebase) {
        switch(createdCanistersByUser.get(user)) {
          case (?existingUserEntries) {
            for (userEntry in existingUserEntries.vals()) {
              if (userEntry.userCanister.canisterType == canisterType) {
                return ?userEntry.userCanister;
              };
            };
            return null;
          };
          case _ { return null; }; // no entries yet
        };
      };
      case (#Backend) {
        switch(createdCanistersByUser.get(user)) {
          case (?existingUserEntries) {
            for (userEntry in existingUserEntries.vals()) {
              if (userEntry.userCanister.canisterType == canisterType) {
                return ?userEntry.userCanister;
              };
            };
            return null;
          };
          case _ { return null; }; // no entries yet
        };
      };
      case _ { return null; }; // Invalid request
    };
  };

  private func addUserEntry(user : Principal, newUserEntry : Types.UserCanisterEntry) : Bool {
    switch(createdCanistersByUser.get(user)) {
      case (?existingUserEntries) {
        createdCanistersByUser.put(user, Array.append<Types.UserCanisterEntry>(existingUserEntries, [newUserEntry]));
        return true;
      };
      case _ {
        // no entries yet
        createdCanistersByUser.put(user, [newUserEntry]);
        return true;
      };
    };
  };

  public shared ({caller}) func createNewCanister(configurationInput : Types.CanisterCreationConfigurationInput) : async Types.CanisterCreationResult {
    if (Principal.isAnonymous(caller)) {
        return #Err(#Unauthorized);
    };
    if (canisterIsPrivate and not Principal.isController(caller)) {
      return #Err(#Unauthorized);
    };

    switch(configurationInput.canisterType) {
      case (#Knowledgebase) {
        // Verify that the user hasn't created any canisters yet (only one canister pair per user is allowed)
        let verifyUserRequestResult = verifyUserRequest(caller, #Knowledgebase);
        if (not verifyUserRequestResult) {
          return #Err(#Other("Your request could not be verified. Please note that only one canister pair per user may be created."));
        };
        let canisterConfiguration : Types.CanisterCreationConfiguration = {
          canisterType : Types.CanisterType = configurationInput.canisterType;
          owner: Principal = caller;
        };
        let createCanisterResult : Types.CanisterCreationResult = await canisterCreationCanister.createCanister(canisterConfiguration);
        
        switch (createCanisterResult) {
          case (#Err(createCanisterError)) {
            return createCanisterResult;
          };
          case (#Ok(createCanisterSuccess)) {
            // Create new entry for user
            let newCanisterInfo : Types.CanisterInfo = {
              canisterType : Types.CanisterType = #Knowledgebase;
              creationTimestamp : Nat64 = Nat64.fromNat(Int.abs(Time.now()));
              canisterAddress : Text = createCanisterSuccess.newCanisterId;
            };
            let userEntry : Types.UserCanisterEntry = {
              userCanister = newCanisterInfo;
            };
            let addEntryResult = addUserEntry(caller, userEntry);
            if (addEntryResult) {
              return createCanisterResult;
            } else {
              return #Err(#Other("There was an error adding the canister entry for the user"));
            };                        
          };
        };
      };
      case (#Backend) {
        // Verify that the user hasn't created any canisters yet (only one canister pair per user is allowed)
        let verifyUserRequestResult = verifyUserRequest(caller, configurationInput.canisterType);
        if (not verifyUserRequestResult) {
          return #Err(#Other("Your request could not be verified. Please note that only one canister pair per user may be created."));
        };
        let canisterConfiguration : Types.CanisterCreationConfiguration = {
          canisterType : Types.CanisterType = configurationInput.canisterType;
          owner: Principal = caller;
        };
        let createCanisterResult : Types.CanisterCreationResult = await canisterCreationCanister.createCanister(canisterConfiguration);
        
        switch (createCanisterResult) {
          case (#Err(createCanisterError)) {
            return createCanisterResult;
          };
          case (#Ok(createCanisterSuccess)) {
            // Create new entry for user
            let newCanisterInfo : Types.CanisterInfo = {
              canisterType : Types.CanisterType = configurationInput.canisterType;
              creationTimestamp : Nat64 = Nat64.fromNat(Int.abs(Time.now()));
              canisterAddress : Text = createCanisterSuccess.newCanisterId;
            };
            let userEntry : Types.UserCanisterEntry = {
              userCanister = newCanisterInfo;
            };
            let addOwnCanisterResult = usersWithOwnBackendCanister.put(caller, createCanisterSuccess.newCanisterId);
            let addEntryResult = addUserEntry(caller, userEntry);
            if (addEntryResult) {
              // Migrate user data to user's new backend canister
              let userBackendCanister = actor (createCanisterSuccess.newCanisterId) : DeVinciBackend;
              // Set canisterIsPrivate variable to true (to indicate it's a user's private backend canister)
              let updateCanisterIsPrivateResponse : Bool = await userBackendCanister.updateCanisterIsPrivate(true);
              if (not updateCanisterIsPrivateResponse) {
                return #Err(#Other("There was an error setting the canister to private"));
              };

              // Migrate user's settings to user's canister
              let getUserSettingsResponse : ?Types.UserSettings = getUserSettings(caller);
              switch (getUserSettingsResponse) {
                case (?userSettings) {
                  //update_caller_settings
                  let updateCallerSettingsResponse = await userBackendCanister.update_caller_settings(userSettings);
                  // TODO: delete user's settings here in the shared backend
                };
                case _ {};
              };
              // Migrate user's chat data to user's canister
              let userChats : List.List<Types.Chat> = getUserChats(caller);
              let migrateUserChatsResponse : Bool = await userBackendCanister.migrate_user_chats(caller, userChats);
              // TODO: delete user's chats here in the shared backend              

              return createCanisterResult;
            } else {
              return #Err(#Other("There was an error adding the canister entry for the user"));
            };                        
          };
        };
      };
      case _ { 
        return #Err(#Other("canisterType not supported"));
      };
    };       
  };

  public query ({caller}) func getUserCanistersEntry(lookupInput : Types.AvailableCanistersRecord) : async Types.UserCanistersEntryResult {
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
    };
    if (canisterIsPrivate and not Principal.isController(caller)) {
      return #Err(#Unauthorized);
    };

    switch(createdCanistersByUser.get(caller)) {
      case (?existingUserEntries) {
        for (userEntry in existingUserEntries.vals()) {
          if (userEntry.userCanister.canisterType == lookupInput.canisterType) {
            return #Ok(userEntry);
          };
        };
        return #Err(#Other("No canister of this type for the user yet."));
      };
      case _ { return #Err(#Other("No entry yet")); };
    };
  };

  public shared ({caller}) func migrate_user_chats(user : Principal, chatsToMigrate : List.List<Types.Chat>) : async Bool {
    if (Principal.isAnonymous(caller)) {
      return false;
    };
    if (not Principal.isController(caller)) {
      return false;
    };
    if (canisterIsPrivate and not Principal.isController(user)) {
      return false
    };

    let migrationResult = List.map<Types.Chat, Bool>(chatsToMigrate, func (chat : Types.Chat) : Bool {
      let chatCreated = putChat(chat);
      let result = putUserChat(user, chat.id);
      if (chatCreated == chat.id and result == chat.id) {
        return true;
      };
      return false; // TODO: error handling      
    });

    return true;
};

  // Admin functions TODO
// Use with caution!
    /* public shared (msg) func deleteUserCanistersEntriesAdmin(user : Text) : async Bool {
        if (Principal.isAnonymous(msg.caller)) {
            return false;
        };
        if (not Principal.isController(msg.caller)) {
            return false;
        };

        creationsByUser.delete(Principal.fromText(user));
        return true;
    };

    public query (msg) func getAllUserCanistersEntriesAdmin() : async ?[(Principal, [Types.UserCreationEntry])] {
        if (Principal.isAnonymous(msg.caller)) {
            return null;
        };
        if (not Principal.isController(msg.caller)) {
            return null;
        };

        return ?Iter.toArray(creationsByUser.entries());
    }; */

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
  public shared ({caller}) func submit_signup_form(submittedSignUpForm : Types.SignUpFormInput) : async Text {
    if (canisterIsPrivate and not Principal.isController(caller)) {
      return "not supported";
    };
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
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
    if (canisterIsPrivate and not Principal.isController(caller)) {
      return false;
    };
    // Only Principals registered as custodians can access this function
    if (List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })) {
      emailSubscribersStorage.delete(emailAddress);
      return true;
    };
    return false;
  };

// Upgrade Hooks
  system func preupgrade() {
    userChatsStorageStable := Iter.toArray(userChatsStorage.entries());
    userSettingsStorageStable := Iter.toArray(userSettingsStorage.entries());
    chatsStorageStable := Iter.toArray(chatsStorage.entries());
    emailSubscribersStorageStable := Iter.toArray(emailSubscribersStorage.entries());
    userMemoryVectorsStorageStable := Iter.toArray(userMemoryVectorsStorage.entries());
    createdCanistersByUserStable := Iter.toArray(createdCanistersByUser.entries());
    usersWithOwnBackendCanisterStable := Iter.toArray(usersWithOwnBackendCanister.entries());
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
    createdCanistersByUser := HashMap.fromIter(Iter.fromArray(createdCanistersByUserStable), createdCanistersByUserStable.size(), Principal.equal, Principal.hash);
    createdCanistersByUserStable := [];
    usersWithOwnBackendCanister := HashMap.fromIter(Iter.fromArray(usersWithOwnBackendCanisterStable), usersWithOwnBackendCanisterStable.size(), Principal.equal, Principal.hash);
    usersWithOwnBackendCanisterStable := [];
  };
};
