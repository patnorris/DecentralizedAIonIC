import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";
import Nat64 "mo:base/Nat64";

module {
    public func newRandomUniqueId() : async Text {
        let g = Source.Source();
        UUID.toText(await g.new());
    };

    
    func textToNat(txt : Text) : Nat {
        assert(txt.size() > 0);
        let chars = txt.chars();

        var num : Nat = 0;
        for (v in chars){
        let charToNum = Nat32.toNat(Char.toNat32(v)-48);
        assert(charToNum >= 0 and charToNum <= 9);
        num := num * 10 +  charToNum;          
        };

        num;
    };

    func textToNat64(txt : Text) : Nat64 {
        assert(txt.size() > 0);
        let chars = txt.chars();

        var num : Nat = 0;
        for (v in chars){
        let charToNum = Nat32.toNat(Char.toNat32(v)-48);
        assert(charToNum >= 0 and charToNum <= 9);
        num := num * 10 +  charToNum;          
        };

        Nat64.fromNat(num);
    };
};
