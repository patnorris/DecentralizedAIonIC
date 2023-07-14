import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'ZeroAddress' : null } |
  { 'InvalidTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : string };
export type AssocList = [] | [[[string, string], List]];
export interface Dip721NonFungibleToken {
  'maxLimit' : number,
  'logo' : LogoResult,
  'name' : string,
  'symbol' : string,
}
export interface EmailSubscriber {
  'subscribedAt' : bigint,
  'emailAddress' : string,
  'pageSubmittedFrom' : string,
}
export type ExtendedMetadataResult = {
    'Ok' : { 'token_id' : TokenId, 'metadata_desc' : MetadataDesc }
  } |
  { 'Err' : ApiError };
export type File = Uint8Array | number[];
export interface FileInfo {
  'file_name' : string,
  'file_content' : Uint8Array | number[],
  'owner_principal' : string,
}
export type FileResult = { 'Ok' : FileResultSuccessOptions } |
  { 'Err' : ApiError };
export type FileResultSuccessOptions = { 'File' : FileInfo } |
  { 'FileNames' : Array<string> } |
  { 'Success' : null } |
  { 'FileId' : string } |
  { 'Other' : string } |
  { 'FileIds' : Array<string> } |
  { 'UserRecord' : UserRecord };
export type HeaderField = [string, string];
export type InterfaceId = { 'Burn' : null } |
  { 'Mint' : null } |
  { 'Approval' : null } |
  { 'TransactionHistory' : null } |
  { 'TransferNotification' : null };
export type List = [] | [[[string, string], List]];
export interface LogoResult { 'data' : string, 'logo_type' : string }
export type MetadataDesc = Array<MetadataPart>;
export interface MetadataKeyVal { 'key' : string, 'val' : MetadataVal }
export interface MetadataPart {
  'data' : Uint8Array | number[],
  'key_val_data' : Array<MetadataKeyVal>,
  'purpose' : MetadataPurpose,
}
export type MetadataPurpose = { 'Preview' : null } |
  { 'Rendered' : null };
export type MetadataResult = { 'Ok' : MetadataDesc } |
  { 'Err' : ApiError };
export type MetadataVal = { 'Nat64Content' : bigint } |
  { 'Nat32Content' : number } |
  { 'Nat8Content' : number } |
  { 'NatContent' : bigint } |
  { 'Nat16Content' : number } |
  { 'TextArrayContent' : Array<string> } |
  { 'BlobContent' : Uint8Array | number[] } |
  { 'PrincipalContent' : Principal } |
  { 'TextToTextAssocListContent' : AssocList } |
  { 'TextContent' : string };
export type MintReceipt = { 'Ok' : MintReceiptPart } |
  { 'Err' : ApiError };
export interface MintReceiptPart { 'id' : bigint, 'token_id' : TokenId }
export interface Nft {
  'id' : TokenId,
  'owner' : Principal,
  'metadata' : MetadataDesc,
}
export type NftResult = { 'Ok' : Nft } |
  { 'Err' : ApiError };
export type OwnerResult = { 'Ok' : Principal } |
  { 'Err' : ApiError };
export interface PersonalWebSpace {
  'balanceOfDip721' : ActorMethod<[Principal], bigint>,
  'check_user_has_nft' : ActorMethod<[], boolean>,
  'createSpace' : ActorMethod<[string], NftResult>,
  'deleteEmailSubscriber' : ActorMethod<[string], boolean>,
  'deleteFile' : ActorMethod<[string], FileResult>,
  'getCallerSpaces' : ActorMethod<[], Array<Nft>>,
  'getEmailSubscribers' : ActorMethod<[], Array<[string, EmailSubscriber]>>,
  'getFile' : ActorMethod<[string], FileResult>,
  'getMaxLimitDip721' : ActorMethod<[], number>,
  'getMetadataDip721' : ActorMethod<[TokenId], MetadataResult>,
  'getMetadataForUserDip721' : ActorMethod<[Principal], ExtendedMetadataResult>,
  'getRandomSpace' : ActorMethod<[], NftResult>,
  'getSpace' : ActorMethod<[TokenId], NftResult>,
  'getTokenIdsForUserDip721' : ActorMethod<
    [Principal],
    BigUint64Array | bigint[]
  >,
  'getUserRecord' : ActorMethod<[], FileResult>,
  'greet' : ActorMethod<[string], string>,
  'http_request' : ActorMethod<[Request], Response>,
  'listUserFileIds' : ActorMethod<[], FileResult>,
  'listUserFileNames' : ActorMethod<[], FileResult>,
  'logoDip721' : ActorMethod<[], LogoResult>,
  'mintDip721' : ActorMethod<[Principal, MetadataDesc], MintReceipt>,
  'nameDip721' : ActorMethod<[], string>,
  'ownerOfDip721' : ActorMethod<[TokenId], OwnerResult>,
  'safeTransferFromDip721' : ActorMethod<
    [Principal, Principal, TokenId],
    TxReceipt
  >,
  'submitSignUpForm' : ActorMethod<[SignUpFormInput], string>,
  'supportedInterfacesDip721' : ActorMethod<[], Array<InterfaceId>>,
  'symbolDip721' : ActorMethod<[], string>,
  'totalSupplyDip721' : ActorMethod<[], bigint>,
  'transferFromDip721' : ActorMethod<
    [Principal, Principal, TokenId],
    TxReceipt
  >,
  'updateUserSpace' : ActorMethod<[UpdateMetadataValuesInput], NftResult>,
  'uploadUserFile' : ActorMethod<[string, File], FileResult>,
}
export interface Request {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
}
export interface Response {
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
  'upgrade' : boolean,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface SignUpFormInput {
  'emailAddress' : string,
  'pageSubmittedFrom' : string,
}
export type StreamingCallback = ActorMethod<
  [StreamingCallbackToken],
  StreamingCallbackResponse
>;
export interface StreamingCallbackResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Uint8Array | number[],
}
export interface StreamingCallbackToken {
  'key' : string,
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }
  };
export type TokenId = bigint;
export type TxReceipt = { 'Ok' : bigint } |
  { 'Err' : ApiError };
export interface UpdateMetadataValuesInput {
  'id' : TokenId,
  'updatedSpaceDescription' : string,
  'updatedOwnerName' : string,
  'updatedOwnerContactInfo' : string,
  'updatedSpaceData' : [] | [string],
  'updatedSpaceName' : string,
}
export interface UserRecord { 'totalSize' : bigint, 'file_ids' : Array<string> }
export interface _SERVICE extends PersonalWebSpace {}
