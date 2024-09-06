export const idlFactory = ({ IDL }) => {
  const ApiError = IDL.Variant({
    'ZeroAddress' : IDL.Null,
    'InvalidTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Text,
  });
  const MemoryVectorsCheckResult = IDL.Variant({
    'Ok' : IDL.Bool,
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
    'embedding' : IDL.Vec(IDL.Float64),
  });
  const MemoryVectorsResult = IDL.Variant({
    'Ok' : IDL.Vec(MemoryVector),
    'Err' : ApiError,
  });
  const UserSettings = IDL.Record({ 'selectedAiModelId' : IDL.Text });
  const UserSettingsResult = IDL.Variant({
    'Ok' : UserSettings,
    'Err' : ApiError,
  });
  const DatabaseToInclude = IDL.Variant({
    'Local' : IDL.Null,
    'None' : IDL.Null,
    'External' : IDL.Null,
  });
  const ExperienceType = IDL.Variant({
    'Onchain' : IDL.Null,
    'Offchain' : IDL.Null,
    'Ondevice' : IDL.Null,
  });
  const EducationExperience = IDL.Record({
    'id' : IDL.Text,
    'isStandaloneApp' : IDL.Bool,
    'title' : IDL.Text,
    'creator' : IDL.Text,
    'note' : IDL.Text,
    'databaseToInclude' : DatabaseToInclude,
    'shortDescription' : IDL.Text,
    'standaloneAppUrl' : IDL.Opt(IDL.Text),
    'databaseIdentifier' : IDL.Opt(IDL.Text),
    'experienceType' : IDL.Opt(ExperienceType),
    'aiModelIdentifier' : IDL.Opt(IDL.Text),
    'longDescription' : IDL.Text,
  });
  const EmailSubscriber = IDL.Record({
    'subscribedAt' : IDL.Nat64,
    'emailAddress' : IDL.Text,
    'pageSubmittedFrom' : IDL.Text,
  });
  const MemoryVectorsStoredResult = IDL.Variant({
    'Ok' : IDL.Bool,
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
    'check_caller_has_memory_vectors_entry' : IDL.Func(
        [],
        [MemoryVectorsCheckResult],
        ['query'],
      ),
    'create_chat' : IDL.Func([IDL.Vec(Message)], [ChatCreationResult], []),
    'delete_chat' : IDL.Func([IDL.Text], [ChatResult], []),
    'delete_email_subscriber' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'get_caller_chat_history' : IDL.Func([], [ChatsPreviewResult], ['query']),
    'get_caller_chats' : IDL.Func([], [ChatsResult], ['query']),
    'get_caller_memory_vectors' : IDL.Func(
        [],
        [MemoryVectorsResult],
        ['query'],
      ),
    'get_caller_settings' : IDL.Func([], [UserSettingsResult], ['query']),
    'get_chat' : IDL.Func([IDL.Text], [ChatResult], ['query']),
    'get_education_experiences' : IDL.Func(
        [],
        [IDL.Vec(EducationExperience)],
        ['query'],
      ),
    'get_email_subscribers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, EmailSubscriber))],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'store_user_chats_memory_vectors' : IDL.Func(
        [IDL.Vec(MemoryVector)],
        [MemoryVectorsStoredResult],
        [],
      ),
    'submit_signup_form' : IDL.Func([SignUpFormInput], [IDL.Text], []),
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
  });
  return DeVinciBackend;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
