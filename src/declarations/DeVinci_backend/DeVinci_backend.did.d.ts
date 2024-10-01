import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

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
  'check_caller_has_memory_vectors_entry' : ActorMethod<
    [],
    MemoryVectorsCheckResult
  >,
  'create_chat' : ActorMethod<[Array<Message>], ChatCreationResult>,
  'delete_chat' : ActorMethod<[string], ChatResult>,
  'delete_email_subscriber' : ActorMethod<[string], boolean>,
  'get_caller_chat_history' : ActorMethod<[], ChatsPreviewResult>,
  'get_caller_chats' : ActorMethod<[], ChatsResult>,
  'get_caller_memory_vectors' : ActorMethod<[], MemoryVectorsResult>,
  'get_caller_settings' : ActorMethod<[], UserSettingsResult>,
  'get_chat' : ActorMethod<[string], ChatResult>,
  'get_email_subscribers' : ActorMethod<[], Array<[string, EmailSubscriber]>>,
  'greet' : ActorMethod<[string], string>,
  'store_user_chats_memory_vectors' : ActorMethod<
    [Array<MemoryVector>],
    MemoryVectorsStoredResult
  >,
  'submit_signup_form' : ActorMethod<[SignUpFormInput], string>,
  'update_caller_settings' : ActorMethod<
    [UserSettings],
    UpdateUserSettingsResult
  >,
  'update_chat_messages' : ActorMethod<[string, Array<Message>], ChatIdResult>,
  'update_chat_metadata' : ActorMethod<[UpdateChatObject], ChatIdResult>,
}
export interface EmailSubscriber {
  'subscribedAt' : bigint,
  'emailAddress' : string,
  'pageSubmittedFrom' : string,
}
export interface MemoryVector {
  'content' : string,
  'metadata' : MemoryVectorMetadata,
  'embedding' : Array<number>,
}
export interface MemoryVectorMetadata { 'id' : bigint }
export type MemoryVectorsCheckResult = { 'Ok' : boolean } |
  { 'Err' : ApiError };
export type MemoryVectorsResult = { 'Ok' : Array<MemoryVector> } |
  { 'Err' : ApiError };
export type MemoryVectorsStoredResult = { 'Ok' : boolean } |
  { 'Err' : ApiError };
export interface Message { 'content' : string, 'sender' : string }
export interface SignUpFormInput {
  'emailAddress' : string,
  'pageSubmittedFrom' : string,
}
export interface UpdateChatObject { 'id' : string, 'chatTitle' : string }
export type UpdateUserSettingsResult = { 'Ok' : boolean } |
  { 'Err' : ApiError };
export interface UserSettings {
  'responseLength' : string,
  'temperature' : number,
  'selectedAiModelId' : string,
  'saveChats' : boolean,
}
export type UserSettingsResult = { 'Ok' : UserSettings } |
  { 'Err' : ApiError };
export interface _SERVICE extends DeVinciBackend {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
