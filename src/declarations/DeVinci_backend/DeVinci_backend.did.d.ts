import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'ZeroAddress' : null } |
  { 'InvalidTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : string };
export interface Chat {
  'id' : string,
  'messages' : Array<Message>,
  'owner' : Principal,
  'creationTime' : bigint,
  'chatTitle' : string,
  'firstMessagePreview' : string,
}
export type ChatCreationResult = { 'Ok' : string } |
  { 'Err' : ApiError };
export type ChatIdResult = { 'Ok' : string } |
  { 'Err' : ApiError };
export interface ChatPreview {
  'id' : string,
  'creationTime' : bigint,
  'chatTitle' : string,
  'firstMessagePreview' : string,
}
export type ChatResult = { 'Ok' : Chat } |
  { 'Err' : ApiError };
export type ChatsPreviewResult = { 'Ok' : Array<ChatPreview> } |
  { 'Err' : ApiError };
export type ChatsResult = { 'Ok' : Array<Chat> } |
  { 'Err' : ApiError };
export interface DeVinciBackend {
  'create_chat' : ActorMethod<[Array<Message>], ChatCreationResult>,
  'delete_chat' : ActorMethod<[string], ChatResult>,
  'delete_email_subscriber' : ActorMethod<[string], boolean>,
  'get_caller_chat_history' : ActorMethod<[], ChatsPreviewResult>,
  'get_caller_chats' : ActorMethod<[], ChatsResult>,
  'get_caller_settings' : ActorMethod<[], UserSettingsResult>,
  'get_chat' : ActorMethod<[string], ChatResult>,
  'get_email_subscribers' : ActorMethod<[], Array<[string, EmailSubscriber]>>,
  'greet' : ActorMethod<[string], string>,
  'submit_signup_form' : ActorMethod<[SignUpFormInput], string>,
  'symmetric_key_verification_key' : ActorMethod<[], string>,
  'update_caller_settings' : ActorMethod<
    [UserSettings],
    UpdateUserSettingsResult
  >,
  'update_chat_messages' : ActorMethod<[string, MessagesObject], ChatIdResult>,
  'update_chat_metadata' : ActorMethod<[UpdateChatObject], ChatIdResult>,
}
export interface EmailSubscriber {
  'subscribedAt' : bigint,
  'emailAddress' : string,
  'pageSubmittedFrom' : string,
}
export interface Message { 'content' : string, 'sender' : string }
export interface SignUpFormInput {
  'emailAddress' : string,
  'pageSubmittedFrom' : string,
}
export interface UpdateChatObject { 'id' : string, 'chatTitle' : string }
export type UpdateUserSettingsResult = { 'Ok' : boolean } |
  { 'Err' : ApiError };
export interface UserSettings { 'selectedAiModelId' : string }
export type UserSettingsResult = { 'Ok' : UserSettings } |
  { 'Err' : ApiError };
export interface _SERVICE extends DeVinciBackend {}
