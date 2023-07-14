import Text "mo:base/Text";
// from https://github.com/patnorris/NewWavePre/tree/firstMotokoVersion/NewWaveV0/0.0.3
module {
    public let CANISTER_ID : Text = "pzrof-pyaaa-aaaai-acnha-cai";
    public let LOCAL_CANISTER_ID : Text = "be2us-64aaa-aaaaa-qaabq-cai";
    
    public class EntitySettings() {
        var mainSetting : Text = "default";
    };
  
    public type EntityType = {
        #BridgeEntity;
        #Webasset;
        #Person;
        #Location;
    };
    
    public type Entity = {
        internalId : Text;
        creationTimestamp : Nat64;
        creator : Principal;
        owner : Principal;
        settings : EntitySettings;
        entityType : EntityType;
        name : ?Text;
        description : ?Text;
        keywords : ?[Text];
        externalId : ?Text;
        entitySpecificFields : ?Text;
        listOfEntitySpecificFieldKeys : [Text];
        // resolveRepresentedEntity : () -> T; // if possible, generic return value, otherwise probably Text
    };
    
    public type EntityInitiationObject = {
        _internalId : ?Text;
        _creator : ?Principal;
        _owner : ?Principal;
        _settings : ?EntitySettings;
        _entityType : EntityType;
        _name : ?Text;
        _description : ?Text;
        _keywords : ?[Text];
        _externalId : ?Text;
        _entitySpecificFields : ?Text;
    };

    public type BridgeState = {
        #Pending;
        #Rejected;
        #Confirmed;
    };

    public type BridgeType = {
        #OwnerCreated;
    };

    public type BridgeEntity = Entity and {
        bridgeType : BridgeType;
        fromEntityId : Text;
        toEntityId : Text;
        state : BridgeState;
    };

    public type BridgeEntityInitiationObject = EntityInitiationObject and {
        _bridgeType : BridgeType;
        _fromEntityId : Text;
        _toEntityId : Text;
        _state : ?BridgeState;
    };

    public type Interface = actor {
        create_entity                       : EntityInitiationObject        -> async Entity;
        get_entity                          : Text                          -> async ?Entity;
        create_bridge                       : BridgeEntityInitiationObject  -> async BridgeEntity;
        get_bridge                          : Text                          -> async ?BridgeEntity;
        get_bridge_ids_by_entity_id         : (entityId : Text, includeBridgesFromEntity : Bool, includeBridgesToEntity : Bool, includeBridgesPendingForEntity : Bool) -> async [Text];
        get_bridges_by_entity_id            : (entityId : Text, includeBridgesFromEntity : Bool, includeBridgesToEntity : Bool, includeBridgesPendingForEntity : Bool) -> async [BridgeEntity];
        create_entity_and_bridge            : (entityToCreate : EntityInitiationObject, bridgeToCreate : BridgeEntityInitiationObject) -> async (Entity, ?BridgeEntity);
        get_bridged_entities_by_entity_id   : (entityId : Text, includeBridgesFromEntity : Bool, includeBridgesToEntity : Bool, includeBridgesPendingForEntity : Bool) -> async [Entity];
        get_entity_and_bridge_ids           : (entityId : Text, includeBridgesFromEntity : Bool, includeBridgesToEntity : Bool, includeBridgesPendingForEntity : Bool) -> async (?Entity, [Text]);
    };
};