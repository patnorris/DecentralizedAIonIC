export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const LogoResult = IDL.Record({ 'data' : IDL.Text, 'logo_type' : IDL.Text });
  const Dip721NonFungibleToken = IDL.Record({
    'maxLimit' : IDL.Nat16,
    'logo' : LogoResult,
    'name' : IDL.Text,
    'symbol' : IDL.Text,
  });
  const TokenId = IDL.Nat64;
  List.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text), List)));
  const AssocList = IDL.Opt(IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text), List));
  const MetadataVal = IDL.Variant({
    'Nat64Content' : IDL.Nat64,
    'Nat32Content' : IDL.Nat32,
    'Nat8Content' : IDL.Nat8,
    'NatContent' : IDL.Nat,
    'Nat16Content' : IDL.Nat16,
    'TextArrayContent' : IDL.Vec(IDL.Text),
    'BlobContent' : IDL.Vec(IDL.Nat8),
    'PrincipalContent' : IDL.Principal,
    'TextToTextAssocListContent' : AssocList,
    'TextContent' : IDL.Text,
  });
  const MetadataKeyVal = IDL.Record({ 'key' : IDL.Text, 'val' : MetadataVal });
  const MetadataPurpose = IDL.Variant({
    'Preview' : IDL.Null,
    'Rendered' : IDL.Null,
  });
  const MetadataPart = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'key_val_data' : IDL.Vec(MetadataKeyVal),
    'purpose' : MetadataPurpose,
  });
  const MetadataDesc = IDL.Vec(MetadataPart);
  const Nft = IDL.Record({
    'id' : TokenId,
    'owner' : IDL.Principal,
    'metadata' : MetadataDesc,
  });
  const ApiError = IDL.Variant({
    'ZeroAddress' : IDL.Null,
    'InvalidTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Text,
  });
  const NftResult = IDL.Variant({ 'Ok' : Nft, 'Err' : ApiError });
  const FileInfo = IDL.Record({
    'file_name' : IDL.Text,
    'file_content' : IDL.Vec(IDL.Nat8),
    'owner_principal' : IDL.Text,
  });
  const UserRecord = IDL.Record({
    'totalSize' : IDL.Nat,
    'file_ids' : IDL.Vec(IDL.Text),
  });
  const FileResultSuccessOptions = IDL.Variant({
    'File' : FileInfo,
    'FileNames' : IDL.Vec(IDL.Text),
    'Success' : IDL.Null,
    'FileId' : IDL.Text,
    'Other' : IDL.Text,
    'FileIds' : IDL.Vec(IDL.Text),
    'UserRecord' : UserRecord,
  });
  const FileResult = IDL.Variant({
    'Ok' : FileResultSuccessOptions,
    'Err' : ApiError,
  });
  const EmailSubscriber = IDL.Record({
    'subscribedAt' : IDL.Nat64,
    'emailAddress' : IDL.Text,
    'pageSubmittedFrom' : IDL.Text,
  });
  const MetadataResult = IDL.Variant({ 'Ok' : MetadataDesc, 'Err' : ApiError });
  const ExtendedMetadataResult = IDL.Variant({
    'Ok' : IDL.Record({ 'token_id' : TokenId, 'metadata_desc' : MetadataDesc }),
    'Err' : ApiError,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const Request = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingCallback = IDL.Func(
      [StreamingCallbackToken],
      [StreamingCallbackResponse],
      ['query'],
    );
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }),
  });
  const Response = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'upgrade' : IDL.Bool,
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const MintReceiptPart = IDL.Record({ 'id' : IDL.Nat, 'token_id' : TokenId });
  const MintReceipt = IDL.Variant({ 'Ok' : MintReceiptPart, 'Err' : ApiError });
  const OwnerResult = IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : ApiError });
  const TxReceipt = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ApiError });
  const SignUpFormInput = IDL.Record({
    'emailAddress' : IDL.Text,
    'pageSubmittedFrom' : IDL.Text,
  });
  const InterfaceId = IDL.Variant({
    'Burn' : IDL.Null,
    'Mint' : IDL.Null,
    'Approval' : IDL.Null,
    'TransactionHistory' : IDL.Null,
    'TransferNotification' : IDL.Null,
  });
  const UpdateMetadataValuesInput = IDL.Record({
    'id' : TokenId,
    'updatedSpaceDescription' : IDL.Text,
    'updatedOwnerName' : IDL.Text,
    'updatedOwnerContactInfo' : IDL.Text,
    'updatedSpaceData' : IDL.Opt(IDL.Text),
    'updatedSpaceName' : IDL.Text,
  });
  const File = IDL.Vec(IDL.Nat8);
  const PersonalWebSpace = IDL.Service({
    'balanceOfDip721' : IDL.Func([IDL.Principal], [IDL.Nat64], ['query']),
    'check_user_has_nft' : IDL.Func([], [IDL.Bool], ['query']),
    'createSpace' : IDL.Func([IDL.Text], [NftResult], []),
    'deleteEmailSubscriber' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'deleteFile' : IDL.Func([IDL.Text], [FileResult], []),
    'getCallerSpaces' : IDL.Func([], [IDL.Vec(Nft)], ['query']),
    'getEmailSubscribers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, EmailSubscriber))],
        [],
      ),
    'getFile' : IDL.Func([IDL.Text], [FileResult], []),
    'getMaxLimitDip721' : IDL.Func([], [IDL.Nat16], ['query']),
    'getMetadataDip721' : IDL.Func([TokenId], [MetadataResult], ['query']),
    'getMetadataForUserDip721' : IDL.Func(
        [IDL.Principal],
        [ExtendedMetadataResult],
        [],
      ),
    'getRandomSpace' : IDL.Func([], [NftResult], []),
    'getSpace' : IDL.Func([TokenId], [NftResult], ['query']),
    'getTokenIdsForUserDip721' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(TokenId)],
        ['query'],
      ),
    'getUserRecord' : IDL.Func([], [FileResult], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'http_request' : IDL.Func([Request], [Response], ['query']),
    'listUserFileIds' : IDL.Func([], [FileResult], []),
    'listUserFileNames' : IDL.Func([], [FileResult], []),
    'logoDip721' : IDL.Func([], [LogoResult], ['query']),
    'mintDip721' : IDL.Func([IDL.Principal, MetadataDesc], [MintReceipt], []),
    'nameDip721' : IDL.Func([], [IDL.Text], ['query']),
    'ownerOfDip721' : IDL.Func([TokenId], [OwnerResult], ['query']),
    'safeTransferFromDip721' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenId],
        [TxReceipt],
        [],
      ),
    'submitSignUpForm' : IDL.Func([SignUpFormInput], [IDL.Text], []),
    'supportedInterfacesDip721' : IDL.Func(
        [],
        [IDL.Vec(InterfaceId)],
        ['query'],
      ),
    'symbolDip721' : IDL.Func([], [IDL.Text], ['query']),
    'totalSupplyDip721' : IDL.Func([], [IDL.Nat64], ['query']),
    'transferFromDip721' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenId],
        [TxReceipt],
        [],
      ),
    'updateUserSpace' : IDL.Func([UpdateMetadataValuesInput], [NftResult], []),
    'uploadUserFile' : IDL.Func([IDL.Text, File], [FileResult], []),
  });
  return PersonalWebSpace;
};
export const init = ({ IDL }) => {
  const LogoResult = IDL.Record({ 'data' : IDL.Text, 'logo_type' : IDL.Text });
  const Dip721NonFungibleToken = IDL.Record({
    'maxLimit' : IDL.Nat16,
    'logo' : LogoResult,
    'name' : IDL.Text,
    'symbol' : IDL.Text,
  });
  return [IDL.Principal, Dip721NonFungibleToken];
};
