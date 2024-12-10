export const idlFactory = ({ IDL }) => {
  const AuthRecord = IDL.Record({ 'auth' : IDL.Text });
  const StatusCode = IDL.Nat16;
  const ApiError = IDL.Variant({
    'InvalidId' : IDL.Null,
    'ZeroAddress' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'StatusCode' : StatusCode,
    'Other' : IDL.Text,
  });
  const AuthRecordResult = IDL.Variant({ 'Ok' : AuthRecord, 'Err' : ApiError });
  const CanisterType = IDL.Variant({
    'Knowledgebase' : IDL.Null,
    'Backend' : IDL.Null,
  });
  const CanisterCreationConfiguration = IDL.Record({
    'canisterType' : CanisterType,
    'owner' : IDL.Principal,
  });
  const CanisterCreationRecord = IDL.Record({
    'creationResult' : IDL.Text,
    'newCanisterId' : IDL.Text,
  });
  const CanisterCreationResult = IDL.Variant({
    'Ok' : CanisterCreationRecord,
    'Err' : ApiError,
  });
  const FileUploadRecord = IDL.Record({ 'creationResult' : IDL.Text });
  const FileUploadResult = IDL.Variant({
    'Ok' : FileUploadRecord,
    'Err' : ApiError,
  });
  const CanisterCreationCanister = IDL.Service({
    'amiController' : IDL.Func([], [AuthRecordResult], []),
    'createCanister' : IDL.Func(
        [CanisterCreationConfiguration],
        [CanisterCreationResult],
        [],
      ),
    'reset_backend_canister_wasm' : IDL.Func([], [FileUploadResult], []),
    'reset_knowledgebase_canister_wasm' : IDL.Func([], [FileUploadResult], []),
    'setMasterCanisterId' : IDL.Func([IDL.Text], [AuthRecordResult], []),
    'testCreateBackendCanister' : IDL.Func([], [CanisterCreationResult], []),
    'testCreateKnowledgebaseCanister' : IDL.Func(
        [],
        [CanisterCreationResult],
        [],
      ),
    'upload_backend_canister_wasm_bytes_chunk' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [FileUploadResult],
        [],
      ),
    'upload_knowledgebase_canister_wasm_bytes_chunk' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [FileUploadResult],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
  return CanisterCreationCanister;
};
export const init = ({ IDL }) => { return []; };
