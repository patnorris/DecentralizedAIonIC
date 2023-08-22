export const idlFactory = ({ IDL }) => {
  const MessagesObject = IDL.Record({
    'messages' : IDL.Text,
    'encrypted' : IDL.Bool,
  });
  const FirstMessagePreviewObject = IDL.Record({
    'encrypted' : IDL.Bool,
    'firstMessagePreview' : IDL.Text,
  });
  const ApiError = IDL.Variant({
    'ZeroAddress' : IDL.Null,
    'InvalidTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Text,
  });
  const ChatCreationResult = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ApiError });
  const Chat = IDL.Record({
    'id' : IDL.Text,
    'messages' : MessagesObject,
    'owner' : IDL.Principal,
    'creationTime' : IDL.Nat64,
    'chatTitle' : IDL.Text,
    'firstMessagePreview' : FirstMessagePreviewObject,
  });
  const ChatResult = IDL.Variant({ 'Ok' : Chat, 'Err' : ApiError });
  const ChatPreview = IDL.Record({
    'id' : IDL.Text,
    'creationTime' : IDL.Nat64,
    'chatTitle' : IDL.Text,
    'firstMessagePreview' : FirstMessagePreviewObject,
  });
  const ChatsPreviewResult = IDL.Variant({
    'Ok' : IDL.Vec(ChatPreview),
    'Err' : ApiError,
  });
  const ChatsResult = IDL.Variant({ 'Ok' : IDL.Vec(Chat), 'Err' : ApiError });
  const UserSettings = IDL.Record({ 'selectedAiModelId' : IDL.Text });
  const UserSettingsResult = IDL.Variant({
    'Ok' : UserSettings,
    'Err' : ApiError,
  });
  const EmailSubscriber = IDL.Record({
    'subscribedAt' : IDL.Nat64,
    'emailAddress' : IDL.Text,
    'pageSubmittedFrom' : IDL.Text,
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
    'app_vetkd_public_key' : IDL.Func(
        [IDL.Vec(IDL.Vec(IDL.Nat8))],
        [IDL.Text],
        [],
      ),
    'create_chat' : IDL.Func(
        [MessagesObject, FirstMessagePreviewObject],
        [ChatCreationResult],
        [],
      ),
    'delete_chat' : IDL.Func([IDL.Text], [ChatResult], []),
    'delete_email_subscriber' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'encrypted_symmetric_key_for_caller' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [IDL.Text],
        [],
      ),
    'get_caller_chat_history' : IDL.Func([], [ChatsPreviewResult], ['query']),
    'get_caller_chats' : IDL.Func([], [ChatsResult], ['query']),
    'get_caller_settings' : IDL.Func([], [UserSettingsResult], ['query']),
    'get_chat' : IDL.Func([IDL.Text], [ChatResult], ['query']),
    'get_email_subscribers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, EmailSubscriber))],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'submit_signup_form' : IDL.Func([SignUpFormInput], [IDL.Text], []),
    'update_caller_settings' : IDL.Func(
        [UserSettings],
        [UpdateUserSettingsResult],
        [],
      ),
    'symmetric_key_verification_key' : IDL.Func([], [IDL.Text], []),
    'update_chat_messages' : IDL.Func(
        [IDL.Text, MessagesObject],
        [ChatIdResult],
        [],
      ),
    'update_chat_metadata' : IDL.Func([UpdateChatObject], [ChatIdResult], []),
  });
  return DeVinciBackend;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
