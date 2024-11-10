export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const Embeddings = IDL.Vec(IDL.Float64);
  const ApiError = IDL.Variant({
    'ZeroAddress' : IDL.Null,
    'InvalidTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Text,
  });
  const MemoryVectorsStoredResult = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : ApiError,
  });
  const AuthRecord = IDL.Record({ 'auth' : IDL.Text });
  const AuthRecordResult = IDL.Variant({ 'Ok' : AuthRecord, 'Err' : ApiError });
  const MemoryVectorsCheckResult = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : ApiError,
  });
  const CanisterType = IDL.Variant({
    'Knowledgebase' : IDL.Null,
    'Backend' : IDL.Null,
  });
  const CanisterCreationConfigurationInput = IDL.Record({
    'canisterType' : CanisterType,
  });
  const CanisterCreationRecord = IDL.Record({
    'creationResult' : IDL.Text,
    'newCanisterId' : IDL.Text,
  });
  const CanisterCreationResult = IDL.Variant({
    'Ok' : CanisterCreationRecord,
    'Err' : ApiError,
  });
  const Message = IDL.Record({ 'content' : IDL.Text, 'sender' : IDL.Text });
  const ChatCreationResult = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ApiError });
  const Chat = IDL.Record({
    'id' : IDL.Text,
    'messages' : IDL.Vec(Message),
    'owner' : IDL.Principal,
    'creationTime' : IDL.Nat64,
    'chatTitle' : IDL.Text,
    'firstMessagePreview' : IDL.Text,
  });
  const ChatResult = IDL.Variant({ 'Ok' : Chat, 'Err' : ApiError });
  const AvailableCanistersRecord = IDL.Record({
    'canisterType' : CanisterType,
  });
  const CanisterInfo = IDL.Record({
    'canisterType' : CanisterType,
    'creationTimestamp' : IDL.Nat64,
    'canisterAddress' : IDL.Text,
  });
  const UserCanisterEntry = IDL.Record({ 'userCanister' : CanisterInfo });
  const UserCanistersEntryResult = IDL.Variant({
    'Ok' : UserCanisterEntry,
    'Err' : ApiError,
  });
  const ChatPreview = IDL.Record({
    'id' : IDL.Text,
    'creationTime' : IDL.Nat64,
    'chatTitle' : IDL.Text,
    'firstMessagePreview' : IDL.Text,
  });
  const ChatsPreviewResult = IDL.Variant({
    'Ok' : IDL.Vec(ChatPreview),
    'Err' : ApiError,
  });
  const ChatsResult = IDL.Variant({ 'Ok' : IDL.Vec(Chat), 'Err' : ApiError });
  const MemoryVectorMetadata = IDL.Record({ 'id' : IDL.Int });
  const MemoryVector = IDL.Record({
    'content' : IDL.Text,
    'metadata' : MemoryVectorMetadata,
    'embedding' : Embeddings,
  });
  const MemoryVectorsResult = IDL.Variant({
    'Ok' : IDL.Vec(MemoryVector),
    'Err' : ApiError,
  });
  const UserSettings = IDL.Record({
    'responseLength' : IDL.Text,
    'temperature' : IDL.Float64,
    'selectedAiModelId' : IDL.Text,
    'systemPrompt' : IDL.Text,
    'saveChats' : IDL.Bool,
  });
  const UserSettingsResult = IDL.Variant({
    'Ok' : UserSettings,
    'Err' : ApiError,
  });
  const EmailSubscriber = IDL.Record({
    'subscribedAt' : IDL.Nat64,
    'emailAddress' : IDL.Text,
    'pageSubmittedFrom' : IDL.Text,
  });
  List.fill(IDL.Opt(IDL.Tuple(Chat, List)));
  const SearchKnowledgeBaseResult = IDL.Variant({
    'Ok' : IDL.Text,
    'Err' : ApiError,
  });
  const SignUpFormInput = IDL.Record({
    'emailAddress' : IDL.Text,
    'pageSubmittedFrom' : IDL.Text,
  });
  const UpdateUserSettingsResult = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : ApiError,
  });
  const ChatIdResult = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ApiError });
  const UpdateChatObject = IDL.Record({
    'id' : IDL.Text,
    'chatTitle' : IDL.Text,
  });
  const DeVinciBackend = IDL.Service({
    'add_to_user_knowledgebase' : IDL.Func(
        [IDL.Text, Embeddings],
        [MemoryVectorsStoredResult],
        [],
      ),
    'amiController' : IDL.Func([], [AuthRecordResult], ['query']),
    'check_caller_has_memory_vectors_entry' : IDL.Func(
        [],
        [MemoryVectorsCheckResult],
        ['query'],
      ),
    'createNewCanister' : IDL.Func(
        [CanisterCreationConfigurationInput],
        [CanisterCreationResult],
        [],
      ),
    'create_chat' : IDL.Func([IDL.Vec(Message)], [ChatCreationResult], []),
    'delete_chat' : IDL.Func([IDL.Text], [ChatResult], []),
    'delete_email_subscriber' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getUserCanistersEntry' : IDL.Func(
        [AvailableCanistersRecord],
        [UserCanistersEntryResult],
        ['query'],
      ),
    'get_caller_chat_history' : IDL.Func([], [ChatsPreviewResult], ['query']),
    'get_caller_chats' : IDL.Func([], [ChatsResult], ['query']),
    'get_caller_memory_vectors' : IDL.Func(
        [],
        [MemoryVectorsResult],
        ['query'],
      ),
    'get_caller_settings' : IDL.Func([], [UserSettingsResult], ['query']),
    'get_chat' : IDL.Func([IDL.Text], [ChatResult], ['query']),
    'get_email_subscribers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, EmailSubscriber))],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'isControllerLogicOk' : IDL.Func([], [AuthRecordResult], []),
    'migrate_user_chats' : IDL.Func([IDL.Principal, List], [IDL.Bool], []),
    'search_user_knowledgebase' : IDL.Func(
        [Embeddings],
        [SearchKnowledgeBaseResult],
        [],
      ),
    'setCanisterCreationCanisterId' : IDL.Func(
        [IDL.Text],
        [AuthRecordResult],
        [],
      ),
    'store_user_chats_memory_vectors' : IDL.Func(
        [IDL.Vec(MemoryVector)],
        [MemoryVectorsStoredResult],
        [],
      ),
    'submit_signup_form' : IDL.Func([SignUpFormInput], [IDL.Text], []),
    'updateCanisterIsPrivate' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'update_caller_settings' : IDL.Func(
        [UserSettings],
        [UpdateUserSettingsResult],
        [],
      ),
    'update_chat_messages' : IDL.Func(
        [IDL.Text, IDL.Vec(Message)],
        [ChatIdResult],
        [],
      ),
    'update_chat_metadata' : IDL.Func([UpdateChatObject], [ChatIdResult], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return DeVinciBackend;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
