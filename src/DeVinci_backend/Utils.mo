import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";
import Text "mo:base/Text";

module {
    public func newRandomUniqueId() : async Text {
        let g = Source.Source();
        UUID.toText(await g.new());
    };
};
