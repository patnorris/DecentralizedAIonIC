import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {
    public type Token = {
        index       : Nat32;
        canister    : [Nat8];
    };

    public func decodeToken (tid : Text) : Token {
        let principal = Principal.fromText(tid);
        let bytes = Blob.toArray(Principal.toBlob(Principal.fromText(tid)));
        var index : Nat8 = 0;
        var _canister : [Nat8] = [];
        var _token_index : [Nat8] = [];
        var _tdscheck : [Nat8] = [];
        var length : Nat8 = 0;
        let tds : [Nat8] = [10, 116, 105, 100]; //b"\x0Atid"
        for (b in bytes.vals()) {
            length += 1;
            if (length <= 4) {
                _tdscheck := Array.append(_tdscheck, [b]);
            };
            if (length == 4) {
                if (Array.equal(_tdscheck, tds, Nat8.equal) == false) {
                    return {
                        index = 0;
                        canister = bytes;
                    };
                };
            };
        };
        for (b in bytes.vals()) {
            index += 1;
            if (index >= 5) {
                if (index <= (length - 4)) {            
                    _canister := Array.append(_canister, [b]);
                } else {
                    _token_index := Array.append(_token_index, [b]);
                };
            };
        };
        let v : Token = {
            index = bytestonat32(_token_index);
            canister = _canister;
        };
        return v;
    };

    private func bytestonat32(b : [Nat8]) : Nat32 {
        var index : Nat32 = 0;
        Array.foldRight<Nat8, Nat32>(b, 0, func (u8, accum) {
            index += 1;
            accum + Nat32.fromNat(Nat8.toNat(u8)) << ((index-1) * 8);
        });
    };

};