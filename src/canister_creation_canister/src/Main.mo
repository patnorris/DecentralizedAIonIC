//import D "mo:base/Debug";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";
import Cycles "mo:base/ExperimentalCycles";

import Types "./Types";

actor class CanisterCreationCanister() = this {

    stable var MASTER_CANISTER_ID : Text = ""; // Corresponds to DeVinci Backend canister

    public shared (msg) func setMasterCanisterId(_master_canister_id : Text) : async Types.AuthRecordResult {
        if (not Principal.isController(msg.caller)) {
            return #Err(#Unauthorized);
        };
        MASTER_CANISTER_ID := _master_canister_id;
        let authRecord = { auth = "You set the master canister for this canister." };
        return #Ok(authRecord);
    };

    // -------------------------------------------------------------------------------
    // Canister Endpoints

    public shared (msg) func whoami() : async Principal {
        return msg.caller;
    };

    public shared (msg) func amiController() : async Types.AuthRecordResult {
        if (not Principal.isController(msg.caller)) {
            return #Err(#Unauthorized);
        };
        let authRecord = { auth = "You are a controller of this canister." };
        return #Ok(authRecord);
    };

    let IC0 : Types.IC_Management = actor ("aaaaa-aa");

    // Admin function to upload knowledgebase canister wasm
    private stable var knowledgebaseCanisterWasm : [Nat8] = [];

    public shared (msg) func upload_knowledgebase_canister_wasm_bytes_chunk(bytesChunk : [Nat8]) : async Types.FileUploadResult {
        if (not Principal.isController(msg.caller)) {
            return #Err(#Unauthorized);
        };

        knowledgebaseCanisterWasm := Array.append(knowledgebaseCanisterWasm, bytesChunk);

        return #Ok({ creationResult = "Success" });
    };

    // Admin function to upload backend canister wasm
    private stable var backendCanisterWasm : [Nat8] = [];

    public shared (msg) func upload_backend_canister_wasm_bytes_chunk(bytesChunk : [Nat8]) : async Types.FileUploadResult {
        if (not Principal.isController(msg.caller)) {
            return #Err(#Unauthorized);
        };

        backendCanisterWasm := Array.append(backendCanisterWasm, bytesChunk);

        return #Ok({ creationResult = "Success" });
    };

    // Spin up a new canister as specified by the input parameters
    public shared (msg) func createCanister(configurationInput : Types.CanisterCreationConfiguration) : async Types.CanisterCreationResult {
        // Only Controllers and the Master canister may call this (plus the cansiter itself for testing functionality)
        if (not (Principal.isController(msg.caller) or Principal.equal(msg.caller, Principal.fromText(MASTER_CANISTER_ID)) or Principal.equal(msg.caller, Principal.fromActor(this)))) {
            return #Err(#Unauthorized);
        };

        switch (configurationInput.canisterType) {
            case (#Knowledgebase) {
                // Create canister
                Cycles.add(300_000_000_000);

                let createdCanister = await IC0.create_canister({
                    settings = ?{
                        freezing_threshold = null;
                        controllers = ?[Principal.fromActor(this), configurationInput.owner];
                        memory_allocation = null;
                        compute_allocation = null;
                    };
                });

                let installControlWasm = await IC0.install_code({
                    arg = "";
                    wasm_module = Blob.fromArray(knowledgebaseCanisterWasm);
                    mode = #install;
                    canister_id = createdCanister.canister_id;
                });

                /* let readyResult = await knowledgebaseCanister.ready();
                switch (readyResult) {
                    case (#Err(error)) {
                        return #Err(error);
                    };
                    case _ {};
                }; */

                // --------------------------------------------------------------------
                let creationRecord = {
                    creationResult = "Success";
                    newCanisterId = Principal.toText(createdCanister.canister_id);
                };
                return #Ok(creationRecord);
            };
            case (#Backend) {
                // Create canister
                Cycles.add(300_000_000_000);

                let createdCanister = await IC0.create_canister({
                    settings = ?{
                        freezing_threshold = null;
                        controllers = ?[Principal.fromActor(this), configurationInput.owner, Principal.fromText(MASTER_CANISTER_ID)];
                        memory_allocation = null;
                        compute_allocation = null;
                    };
                });

                // DeVinciBackend(custodian: Principal, _canister_creation_canister_id : Text)
                let argInstall = {
                    custodian : Principal = configurationInput.owner;
                    _canister_creation_canister_id : Text = Principal.toText(Principal.fromActor(this));
                };

                let installControlWasm = await IC0.install_code({
                    //arg = to_candid(#Init(argInstall));
                    arg = to_candid(configurationInput.owner);
                    wasm_module = Blob.fromArray(backendCanisterWasm);
                    mode = #install;
                    canister_id = createdCanister.canister_id;
                });

                // TODO: setCanisterCreationCanisterId

                /* let readyResult = await knowledgebaseCanister.ready();
                switch (readyResult) {
                    case (#Err(error)) {
                        return #Err(error);
                    };
                    case _ {};
                }; */               

                // --------------------------------------------------------------------
                let creationRecord = {
                    creationResult = "Success";
                    newCanisterId = Principal.toText(createdCanister.canister_id);
                };
                return #Ok(creationRecord);
            };
            case _ { 
                return #Err(#Other("canisterType not supported"));
            };
        };
    };

// Admin 
    public shared (msg) func testCreateKnowledgebaseCanister() : async Types.CanisterCreationResult {
        if (Principal.isAnonymous(msg.caller)) {
            return #Err(#Unauthorized);
        };
        if (not Principal.isController(msg.caller)) {
            return #Err(#Unauthorized);
        };
        let config = {
            canisterType : Types.CanisterType = #Knowledgebase;
            owner : Principal = msg.caller;
        };
        let result = await createCanister(config);
        return result;
    };

    public shared (msg) func testCreateBackendCanister() : async Types.CanisterCreationResult {
        if (Principal.isAnonymous(msg.caller)) {
            return #Err(#Unauthorized);
        };
        if (not Principal.isController(msg.caller)) {
            return #Err(#Unauthorized);
        };
        let config = {
            canisterType : Types.CanisterType = #Backend;
            owner : Principal = msg.caller;
        };
        let result = await createCanister(config);
        return result;
    };

    // Use with caution: Admin function to reset the canister wasm
    public shared (msg) func reset_knowledgebase_canister_wasm() : async Types.FileUploadResult {
        if (Principal.isAnonymous(msg.caller)) {
            return #Err(#Unauthorized);
        };
        if (not Principal.isController(msg.caller)) {
            return #Err(#Unauthorized);
        };

        knowledgebaseCanisterWasm := [];

        return #Ok({ creationResult = "Success" });
    };

    // Use with caution: Admin function to reset the canister wasm
    public shared (msg) func reset_backend_canister_wasm() : async Types.FileUploadResult {
        if (Principal.isAnonymous(msg.caller)) {
            return #Err(#Unauthorized);
        };
        if (not Principal.isController(msg.caller)) {
            return #Err(#Unauthorized);
        };

        backendCanisterWasm := [];

        return #Ok({ creationResult = "Success" });
    };

    // -------------------------------------------------------------------------------
    // Canister upgrades

    // System-provided lifecycle method called before an upgrade.
   /*  system func preupgrade() {
        // Copy the runtime state back into the stable variable before upgrade.
    };

    // System-provided lifecycle method called after an upgrade or on initial deploy.
    system func postupgrade() {
        // After upgrade, reload the runtime state from the stable variable.
    }; */
    // -------------------------------------------------------------------------------
};
