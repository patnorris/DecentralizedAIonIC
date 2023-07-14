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



shared actor class PersonalWebSpace(custodian: Principal, init : Types.Dip721NonFungibleToken) = Self {
// TODO: instead add functions to manage cycles balance and gather stats
  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  let personalWebSpace_frontend_canister_id_mainnet : Text = "vdfyi-uaaaa-aaaai-acptq-cai"; // deployed on mainnet
  let personalWebSpace_backend_canister_id_mainnet : Text = "vee64-zyaaa-aaaai-acpta-cai"; // deployed on mainnet

  // DIP721 standard: https://github.com/dfinity/examples/blob/master/motoko/dip-721-nft-container/src/Main.mo
  stable var transactionId: Types.TransactionId = 0;
  stable var nfts = List.nil<Types.Nft>();
  stable var custodians = List.make<Principal>(custodian);
  stable var logo : Types.LogoResult = init.logo;
  stable var name : Text = init.name;
  stable var symbol : Text = init.symbol;
  stable var maxLimit : Nat16 = init.maxLimit;

  // https://forum.dfinity.org/t/is-there-any-address-0-equivalent-at-dfinity-motoko/5445/3
  let null_address : Principal = Principal.fromText("aaaaa-aa");

  public query func balanceOfDip721(user: Principal) : async Nat64 {
    return Nat64.fromNat(
      List.size(
        List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user })
      )
    );
  };

  public query func ownerOfDip721(token_id: Types.TokenId) : async Types.OwnerResult {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token.owner);
      };
    };
  };

  public shared({ caller }) func safeTransferFromDip721(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {  
    if (to == null_address) {
      return #Err(#ZeroAddress);
    } else {
      return transferFrom(from, to, token_id, caller);
    };
  };

  public shared({ caller }) func transferFromDip721(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {
    return transferFrom(from, to, token_id, caller);
  };

  func transferFrom(from: Principal, to: Principal, token_id: Types.TokenId, caller: Principal) : Types.TxReceipt {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case null {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        if (
          caller != token.owner and
          not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })
        ) {
          return #Err(#Unauthorized);
        } else if (Principal.notEqual(from, token.owner)) {
          return #Err(#Unauthorized);
        } else {
          nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
            if (item.id == token.id) {
              let update : Types.Nft = {
                owner = to;
                id = item.id;
                metadata = token.metadata;
              };
              return update;
            } else {
              return item;
            };
          });
          transactionId += 1;
          return #Ok(transactionId);   
        };
      };
    };
  };

  public query func supportedInterfacesDip721() : async [Types.InterfaceId] {
    return [#TransferNotification, #Burn, #Mint];
  };

  public query func logoDip721() : async Types.LogoResult {
    return logo;
  };

  public query func nameDip721() : async Text {
    return name;
  };

  public query func symbolDip721() : async Text {
    return symbol;
  };

  public query func totalSupplyDip721() : async Nat64 {
    return Nat64.fromNat(
      List.size(nfts)
    );
  };

  public query func getMetadataDip721(token_id: Types.TokenId) : async Types.MetadataResult {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case null {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token.metadata);
      }
    };
  };

  public query func getMaxLimitDip721() : async Nat16 {
    return maxLimit;
  };

  public func getMetadataForUserDip721(user: Principal) : async Types.ExtendedMetadataResult {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    switch (item) {
      case null {
        return #Err(#Other("No token found for this user"));
      };
      case (?token) {
        return #Ok({
          metadata_desc = token.metadata;
          token_id = token.id;
        });
      }
    };
  };

  public query func getTokenIdsForUserDip721(user: Principal) : async [Types.TokenId] {
    let items = List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    let tokenIds = List.map(items, func (item : Types.Nft) : Types.TokenId { item.id });
    return List.toArray(tokenIds);
  };

  public shared query ({caller}) func check_user_has_nft() : async Bool {
    let user = caller;
    let items = List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    let tokenIds = List.map(items, func (item : Types.Nft) : Types.TokenId { item.id });
    let userTokenIds = List.toArray(tokenIds);
    if (userTokenIds.size() == 0) {
      return false;
    } else {
      return true;
    }
  };

  public shared({ caller }) func mintDip721(to: Principal, metadata: Types.MetadataDesc) : async Types.MintReceipt {
    if (not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })) {
      return #Err(#Unauthorized);
    };

    let newId = Nat64.fromNat(List.size(nfts));
    let nft : Types.Nft = {
      owner = to;
      id = newId;
      metadata = metadata;
    };

    var tempList = List.nil<Types.Nft>();
    tempList := List.push(nft, tempList);
    nfts := List.append(nfts, tempList);

    transactionId += 1;

    return #Ok({
      token_id = newId;
      id = transactionId;
    });
  };

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
  // ##################### NFT Details #################
  // defined according to NFT in Types 
  /* 
    Types.MetadataDesc for this project looks like:
      [
        {
          purpose: #Rendered ;
          data: spaceAsHtmlTextBlob // Text.encodeUtf8(spaceAsHtmlText) to get Blob from Text (probably change to spaceAsJsonFormattedTextBlob later)
          key_val_data: [
            {
              key = "ownerName";
              val = #TextContent ownerName;
            },
            {
              key = "ownerContactInfo";
              val = #TextContent ownerContactInfo;
            },
            {
              key = "aboutDescription";
              val = #TextContent aboutDescription;
            },
            {
              key = "spaceDescription";
              val = #TextContent spaceDescription;
            },
            {
              key = "spaceName";
              val = #TextContent spaceName;
            },
            {
              key = "creator";
              val: #PrincipalContent caller;
            },
            {
              key = "creationTime";
              val = #Nat64Content generatedTimestamp;
            },
            {
              key = "protocolEntityId";
              val = #TextContent protocolEntityId;
            },
          ];
        }
      ]
   */

  public shared({ caller }) func createSpace(spaceHtml : Text) : async Types.NftResult {
    // don't allow anonymous Principal
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
		};

    let newId = Nat64.fromNat(List.size(nfts));

    // create space as Entity in Protocol
    let entityInitiationObject : Protocol.EntityInitiationObject = {
        _internalId : ?Text = null;
        _creator : ?Principal = ?caller;
        _owner : ?Principal = ?caller;
        _settings : ?Protocol.EntitySettings = null;
        _entityType : Protocol.EntityType = #Webasset;
        _name : ?Text = ?"Personal Web Space";
        _description : ?Text = ?"Flaming Hot Personal Web Space";
        _keywords : ?[Text] = ?["NFT", "Space", "heeyah"];
        _externalId : ?Text = ?("https://" # personalWebSpace_frontend_canister_id_mainnet # ".ic0.app/#/space/" # Nat64.toText(newId));
        _entitySpecificFields : ?Text = null;
    };
    //__________Local vs Mainnet Development____________
    var protocolEntityId : Text = ""; // enough for local development
    if (Principal.fromActor(Self) == Principal.fromText(personalWebSpace_backend_canister_id_mainnet)) {
      // Live on Mainnet
      let spaceEntity : Protocol.Entity = await protocol.create_entity(entityInitiationObject); // Bebb Protocol call
      protocolEntityId := spaceEntity.internalId;
    } else {
      // Local
      let localProtocol  : Protocol.Interface  = actor(Protocol.LOCAL_CANISTER_ID);
      let spaceEntity : Protocol.Entity = await localProtocol.create_entity(entityInitiationObject);
      protocolEntityId := spaceEntity.internalId;
    };    

    // create space for caller
    let textArrayContent : [Text] = [];
    let keyValData : [Types.MetadataKeyVal] = [
      {
        key = "ownerName";
        val = #TextContent "";
      },
      {
        key = "ownerContactInfo";
        val = #TextContent "";
      },
      {
        key = "aboutDescription";
        val = #TextContent "This is my flaming hot Personal Web Space. Enjoy!";
      },
      {
        key = "spaceDescription";
        val = #TextContent "My virtual home - heeyah";
      },
      {
        key = "spaceName";
        val = #TextContent "My Flaming Hot Personal Web Space";
      },
      {
        key = "creator";
        val = #PrincipalContent caller;
      },
      {
        key = "creationTime";
        val = #Nat64Content (Nat64.fromNat(Int.abs(Time.now())));
      },
      {
        key = "protocolEntityId";
        val = #TextContent protocolEntityId;
      }
    ];
    let nftData = Text.encodeUtf8(spaceHtml);
    
    let metadataPart : Types.MetadataPart = {
      purpose = #Rendered;
      key_val_data = keyValData;
      data = nftData; //provided space HTML
    };
    let metadata : Types.MetadataDesc = [metadataPart];
    let nft : Types.Nft = {
      owner = caller;
      id = newId;
      metadata = metadata;
    };

    var tempList = List.nil<Types.Nft>();
    tempList := List.push(nft, tempList);
    nfts := List.append(nfts, tempList);

    transactionId += 1;

    return #Ok(nft);
  };

  public shared query ({caller}) func getCallerSpaces() : async [Types.Nft] {
    let spaces = List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == caller });
    return List.toArray(spaces); 
  };

  public shared query ({caller}) func getSpace(spaceId : Types.TokenId) : async Types.NftResult {
    let item = List.get(nfts, Nat64.toNat(spaceId));
    switch (item) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token);
      };
    };
  };

  public func getRandomSpace() : async Types.NftResult {
    let numberOfSpaces = List.size(nfts);
    if (numberOfSpaces > 0) {
      let random = Random.Finite(await Random.blob());
      var p : Nat8 = 16;
      
      if (numberOfSpaces < 256) {
        p := 8;
      } else if (numberOfSpaces < 2049) {
        p := 11;
      } else if (numberOfSpaces < 8193) {
        p := 13;
      };
      switch (random.range(p)) {
        case (null) {
          return #Err(#Other("Error retrieving a random space"));
        };
        case (?randomNumber) {
          let spaceId = randomNumber % numberOfSpaces;
          let item = List.get(nfts, spaceId);
          switch (item) {
            case (null) {
              return #Err(#InvalidTokenId);
            };
            case (?token) {
              return #Ok(token);
            };
          };
        };
      };
    } else {
      return #Err(#Other("No space available"));
    };
  };

  // Update a Space's metadata fields including the Space's data which is displayed (if updatedSpaceData is provided)
  public shared({ caller }) func updateUserSpace(updatedUserSpaceData: Types.UpdateMetadataValuesInput) : async Types.NftResult {
    switch (List.get(nfts, Nat64.toNat(updatedUserSpaceData.id))) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        // only owner may update
        if (token.owner != caller) {
          return #Err(#Unauthorized);
        };
        // assemble updated space data, then update nfts list
          // create placeholder objects...
        var aboutDescriptionObject = {
          key = "aboutDescription";
          val: Types.MetadataVal = #TextContent "This is my flaming hot Personal Web Space. Enjoy!";
        };
        var creatorObject = {
          key = "creator";
          val: Types.MetadataVal = #PrincipalContent caller;
        };
        var creationTimeObject = {
          key = "creationTime";
          val: Types.MetadataVal = #Nat64Content (Nat64.fromNat(0));
        };
        var protocolEntityIdObject = {
          key = "protocolEntityId";
          val: Types.MetadataVal = #TextContent "";
        };
          // ... and fill them with space's current data
        for (i in token.metadata[0].key_val_data.keys()) {
          if (token.metadata[0].key_val_data[i].key == "aboutDescription") {
            aboutDescriptionObject := token.metadata[0].key_val_data[i]; // currently not used, thus remains unchanged
          } else if (token.metadata[0].key_val_data[i].key == "creator") {
            creatorObject := token.metadata[0].key_val_data[i]; // should always remain unchanged
          } else if (token.metadata[0].key_val_data[i].key == "creationTime") {
            creationTimeObject := token.metadata[0].key_val_data[i]; // should always remain unchanged
          } else if (token.metadata[0].key_val_data[i].key == "protocolEntityId") {
            protocolEntityIdObject := token.metadata[0].key_val_data[i]; // should always remain unchanged
          }; 
        };

        let updatedKeyValData: [Types.MetadataKeyVal] = [
          {
            key = "ownerName";
            val = #TextContent (updatedUserSpaceData.updatedOwnerName);
          },
          {
            key = "ownerContactInfo";
            val = #TextContent (updatedUserSpaceData.updatedOwnerContactInfo);
          },
          aboutDescriptionObject,
          {
            key = "spaceDescription";
            val = #TextContent (updatedUserSpaceData.updatedSpaceDescription);
          },
          {
            key = "spaceName";
            val = #TextContent (updatedUserSpaceData.updatedSpaceName);
          },
          creatorObject,
          creationTimeObject,
          protocolEntityIdObject
        ];
        // updatedSpaceData is an optional attribute; only use it to update the Space if it was provided
        let spaceData = switch(updatedUserSpaceData.updatedSpaceData) {
          case (null) {token.metadata[0].data};
          case (?"") {token.metadata[0].data};
          case (?updatedSpaceData) {Text.encodeUtf8(updatedSpaceData)} //TODO: probably check provided HTML
        };
        let updatedMetadataPart : Types.MetadataPart = {
          purpose = #Rendered;
          key_val_data = updatedKeyValData;
          data = spaceData;
        };
        let updatedMetadata : Types.MetadataDesc = [updatedMetadataPart];
        let updatedNft : Types.Nft = {
          owner = token.owner;
          id = token.id;
          metadata = updatedMetadata;
        };

        // add updated space to list of NFTs
        nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
          if (item.id == token.id) {
            return updatedNft;
          } else {
            return item;
          };
        });
        transactionId += 1;
        switch (List.get(nfts, Nat64.toNat(updatedUserSpaceData.id))) {
          case (null) {
            return #Err(#InvalidTokenId);
          };
          case (?updatedSpace) {
            return #Ok(updatedSpace);
          }
        };
      };
    };
  };

// Protocol integration
  private let protocol  : Protocol.Interface  = actor(Protocol.CANISTER_ID);


// HTTP interface
  public query func http_request(request : HTTP.Request) : async HTTP.Response {
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
  };


/* 
 * 
 *
 *
 *
 *  Code for uploading files
 *
 *
 *
*/
// 1 MB is the max size for a single file
let oneMB : Nat = 1048576; // 1 MB
private let maxFileSize : Nat = oneMB; 
private let maxTotalSize : Nat = 10 * oneMB;
private let maxFiles : Nat = 10;

// A simple file storage database which stores a unique file ID in the form of a 128 bit (16 byte) UUID as 
//  defined by RFC 4122
// Files should be synced with the UserRecord associated with it to keep the user/data scheme in sync
private var fileDatabase : HashMap.HashMap<Text, FileTypes.FileInfo> = HashMap.HashMap(0, Text.equal, Text.hash);
// Stable version of the file database for cansiter upgrades
stable var fileDatabaseStable : [(Text, FileTypes.FileInfo)] = [];

// Variable stores reference of a user with all the files they have uploaded to their account.
//  The user record stores reference to all the UUIDs for the files they have stored
private var userFileRecords : HashMap.HashMap<Text, FileTypes.UserRecord> = HashMap.HashMap(0, Text.equal, Text.hash); 
// Stable version of the userFileRecords for canister upgrades
stable var userFileRecordsStable : [(Text, FileTypes.UserRecord)] = [];

/*
 * Function retrieves the total size of the files uploaded to their account
 * 
 * @params user: The user id associated with the account, i.e a text representation of the principal
 * @return The total size of files uploaded to their account 
*/
private func getUserFilesTotalSize(user: FileTypes.FileUserId) : Nat {
  switch (userFileRecords.get(Principal.toText(user))) {
    case (null) { return 0; };
    case (?userRecord) { return userRecord.totalSize; };
  };
};

/*
 * Function all the file ids associated with the user account
 * @params user: The user id associated with the account, i.e a text representation of the principal
 * @return All the File Ids associated with the user account. The file Ids can be used to retrieve the files
 *  stored within the fileDatabase
*/
private func getUserFileIds(user: FileTypes.FileUserId) : [Text] {
  switch (userFileRecords.get(Principal.toText(user))) {
    case (null) { return []; };
    case (?userRecord) {
       return userRecord.file_ids; 
       };
  };
};

/*
 * Function retrives all the FileInfo (i.e files) associated with the user account
 * @params user: The user id associated with the account, i.e a text representation of the principal
 * @return All the FileInfo structs for the user account which contain the file and other relevant information
*/
private func getUserFiles(user: FileTypes.FileUserId) : Buffer.Buffer<FileTypes.FileInfo> {
  switch (userFileRecords.get(Principal.toText(user))) {
    case (null) { return Buffer.Buffer<FileTypes.FileInfo>(0); };
    case (?userRecord) { 
      var userFileInfo = Buffer.Buffer<FileTypes.FileInfo>(userRecord.file_ids.size());
      for (file_id in userRecord.file_ids.vals())
      {
        let retrievedFileInfo : ?FileTypes.FileInfo = fileDatabase.get(file_id);
          switch (retrievedFileInfo) {
            case(null) {};
            case(?checkedFileInfo) {
                userFileInfo.add(checkedFileInfo);
            }
        };

      };      
      return userFileInfo;      
      };
  };
};

/*
 * Function which checks the file extension and ensures that it is within the supported formats
 * 
 * @params fileName: The file name to check to see if it is valid
 * @return Whether the file name is a valid type
 *
 * @note: Checking if a file is valid via the file extension is generally  dumb since it is easy to change.
 *          In the future we want to add the ability to inspect the file and ensure it is actually the file
 *          it claims to be.
*/
private func isValidFileExtension(fileName : Text) : Bool {
  let validExtensions : [Text] = ["glb", "gltf" ];
  var extensionMatched : Bool = false;
  for (extension in validExtensions.vals())
  {
    if (Text.endsWith(fileName, #text extension))
    {
      extensionMatched := true;
    };
  };

  return extensionMatched;
};

/*
 * Public Function which enables a logged in user to upload a file to their account if they have enough space available
 * @params fileName: The file name that the uploaded file should be called 
 * @params content: The file to be uploaded 
 * @return A text of the results of the uploading status
*/
public shared(msg) func uploadUserFile(fileName : Text, content : FileTypes.File) : async FileTypes.FileResult {

  let user = msg.caller;

  if (Principal.isAnonymous(user))
  {
    return #Err(#Unauthorized);
  };

  // Ensure that the file extension is supported
  let validExtension : Bool = isValidFileExtension(fileName);
  if (validExtension == false) {
    return #Err(#Other("File Extension not valid"));
  };

  // Make sure the new file isn't above the limit
  let fileSize = content.size();
  if (fileSize > maxFileSize) {
    return #Err(#Other("Error: File size exceeds the limit."));
  };

  // Ensure that the user isn't uploading an empty file
  if (fileSize <= 0) {
    return #Err(#Other("Error: File Empty"));
  };

  // Check to make sure a file with that name isn't already uploaded
  let userFiles = getUserFiles(user);
  var fileNameAlreadyExists : Bool = false;
  for (fileInfo in userFiles.vals())
  {
    if (fileInfo.file_name == fileName)
    {
      fileNameAlreadyExists := true;
    };
  };
  if (fileNameAlreadyExists)
  {
    return #Err(#Other("Error: File Name Already Exists"));
  };

  // Retrieve the total amount of data stored by the user
  let userTotalSize = getUserFilesTotalSize(user);
  if (userTotalSize + fileSize > maxTotalSize) {
    return #Err(#Other("Error: Total size limit reached."));
  };

  // Retrieve all the file ids used by the current user
  let userFilesIds = getUserFileIds(user);
  if (userFilesIds.size() >= maxFiles) {
    return #Err(#Other("Error: File limit reached."));
  };

  var found_unique_file_id : Bool = false;
  var counter : Nat = 0;
  var newFileId : Text = "";

  // Keep searching for a unique name until one is found, the chances of collisions are really low
  //  but in case it happens keep looping until a file id is not found
  while(not found_unique_file_id)
  {
    // 100 is chosen arbitarily to ensure that in case of something weird happening
    //  there is a timeout and it errors rather then looking forever
    if (counter > 100)
    {
      return #Err(#Other("Error: Failed to upload file due to not finding a unique identifier, please contact support"));
    };

    // Technically there is a race condition here... lets see if we can make this an atomic 
    //  operation. For now since the chance of a collision is realllly low, the chance that two names within
    //  the time the UUID is checked and then aquired 1 line later happens to be the same is small
    //  we can leave this for now. When we have higher usage we probably should integrate to a more robust
    //  database system with atomic operations anyways.
    // The only risk is if the randomness in the names isn't that random? We will have to see how robust the Random module is.
    //  Checking for race conditions in the uploading will need to be checked in the future
    newFileId := await Utils.newRandomUniqueId();
    if (fileDatabase.get(newFileId) == null)
    {
      // Claim the id by putting an empty record into it
      fileDatabase.put(newFileId, { file_name = "blank"; file_content = ""; owner_principal = "blank"});
      found_unique_file_id := true;
    };

    counter := counter + 1;
  };

  // Add the new file to the file database
  let file_info = { file_name = fileName; file_content = content; owner_principal = Principal.toText(user) };
  fileDatabase.put(newFileId, file_info);

  // Add the new file id to the user record
  let newFilesId = Array.append(userFilesIds,[newFileId]);
  let newUserRecord = {file_ids = newFilesId; totalSize = userTotalSize + fileSize };
  userFileRecords.put(Principal.toText(user), newUserRecord);

  return #Ok(#Success);
};

/*
 * Public Function which displays all the file names that the user has uploaded to their account
 * @return An array of text that contain all the file names uploaded to the current users account
*/
public shared(msg) func listUserFileNames() : async FileTypes.FileResult {
  let user = msg.caller;
  let userFiles = getUserFiles(user);
  return #Ok(#FileNames(Array.map<FileTypes.FileInfo, Text>(userFiles.toArray(), func fileInfo = fileInfo.file_name)));
};

/*
 * Public Function which displays all the file ids that the user has uploaded to their account
 * @return An array of text that contain all the file ids uploaded to the current users account
*/
public shared(msg) func listUserFileIds() : async FileTypes.FileResult {
  let user = msg.caller;
  let userFileIds = getUserFileIds(user);
  return #Ok(#FileIds(userFileIds));
};

/*
 * Public Function which retrieves a file info by file id
 * Currently there are no visability constraints on files, but once visability is built it can be added here
 *
 * @return The file info associated with the file id
*/
public shared(msg) func getFile(fileId: Text) : async FileTypes.FileResult {
  let retrievedFile = fileDatabase.get(fileId);
  switch (retrievedFile)
  {
    case(null) {return #Err(#Other("Error getting file"));};
    case(?file) {
      return #Ok(#File(file));
    };
  };
};

/*
 * Public Function which retrieves the logged in users userRecord
 *
 * @return The user record associated with the logged in users
*/
public shared(msg) func getUserRecord() : async FileTypes.FileResult {
  let user = msg.caller;
  let retrievedUserRecord = userFileRecords.get(Principal.toText(user));
  switch(retrievedUserRecord) {
    case(null) {#Err(#Other("Error getting user record"));};
    case(?userRecord) {#Ok(#UserRecord(userRecord));};
  };
};

/*
 * Public Function which deletes the file_id that is passed in
 * The file must be owned by the current logged in user to allow deleting the file
 *
 * @return The file info associated with the file id
*/
public shared(msg) func deleteFile(fileId: Text) : async FileTypes.FileResult {
  let user = msg.caller;

  if (Principal.isAnonymous(user))
  {
    return #Err(#Unauthorized);
  };

  // Check to make sure that the user owns the file attempting to be deleted
  let userFileIds = getUserFileIds(user);
  let fileIdOwnedByUser : Bool = Array.find<Text>(userFileIds, func x = fileId == x) != null;
  if (fileIdOwnedByUser == false)
  {
    return #Err(#Other("Error deleting file"));
  };

  // Figure out the size of the file attempting to be deleted
  let fileInfo : ?FileTypes.FileInfo = fileDatabase.get(fileId);
  var fileSize = 0;
  switch (fileInfo) {
    case (null) { fileSize := 0;};
    case (?value) { fileSize := value.file_content.size(); };
  };

  // // Attempt to retrieve the user record and then delete the file and then update
  //  the user record to reflect the file being deleted
  let optionalUserRecord : ?FileTypes.UserRecord = userFileRecords.get(Principal.toText(user));
  switch (optionalUserRecord) {
    case (null) {
      return  #Err(#Other("Error deleting file"));
    };
    case (?userRecord) {

      // Delete the file
      let deleteFileResult = fileDatabase.remove(fileId);

      // Delete the file from the user record and reduce the file size
      let updatedFileIds : [Text] = Array.filter<Text>(userFileIds, func x = x != fileId);
      let newUserRecord : FileTypes.UserRecord = {file_ids = updatedFileIds; totalSize = userRecord.totalSize - fileSize; };
      userFileRecords.put(Principal.toText(user), newUserRecord);
    };
  };

    return #Ok(#Success);
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
  public func submitSignUpForm(submittedSignUpForm : Types.SignUpFormInput) : async Text {
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
  public shared({ caller }) func getEmailSubscribers() : async [(Text, Types.EmailSubscriber)] {
    // Only Principals registered as custodians can access this function
    if (List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })) {
      return Iter.toArray(emailSubscribersStorage.entries());
    };
    return [];
  };

  // Function for custodian to delete an email subscriber
  public shared({ caller }) func deleteEmailSubscriber(emailAddress : Text) : async Bool {
    // Only Principals registered as custodians can access this function
    if (List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })) {
      emailSubscribersStorage.delete(emailAddress);
      return true;
    };
    return false;
  };

// Upgrade Hooks
  system func preupgrade() {
    fileDatabaseStable := Iter.toArray(fileDatabase.entries());
    userFileRecordsStable := Iter.toArray(userFileRecords.entries());
    emailSubscribersStorageStable := Iter.toArray(emailSubscribersStorage.entries());
  };

  system func postupgrade() {
    fileDatabase := HashMap.fromIter(Iter.fromArray(fileDatabaseStable), fileDatabaseStable.size(), Text.equal, Text.hash);
    fileDatabaseStable := [];
    userFileRecords := HashMap.fromIter(Iter.fromArray(userFileRecordsStable), userFileRecordsStable.size(), Text.equal, Text.hash);
    userFileRecordsStable := [];
    emailSubscribersStorage := HashMap.fromIter(Iter.fromArray(emailSubscribersStorageStable), emailSubscribersStorageStable.size(), Text.equal, Text.hash);
    emailSubscribersStorageStable := [];
  };
};
