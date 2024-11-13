import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface PlainDoc { 'content' : string }
export interface VecDoc { 'content' : string, 'embeddings' : Array<number> }
export type VecQuery = { 'Embeddings' : Array<number> };
export interface _SERVICE {
  'add' : ActorMethod<[VecDoc], string>,
  'check_cycles_and_topup' : ActorMethod<[], undefined>,
  'delete' : ActorMethod<[VecDoc], undefined>,
  'get_owner' : ActorMethod<[], [] | [Principal]>,
  'search' : ActorMethod<[VecQuery, bigint], [] | [Array<PlainDoc>]>,
  'size' : ActorMethod<[], bigint>,
  'update_owner' : ActorMethod<[Principal], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
