// adapted from: https://tutorials.icdevs.org/tutorials/serving_svg_over_http/
// with https://gist.github.com/SuddenlyHazel/26613b42974b88dade60a9db6265fe32
// and https://github.com/dfinity/agent-rs/pull/195

import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Blob "mo:base/Blob";
import Text "mo:base/Text";

module {
    public type HeaderField = (Text, Text);
    public type Request = {
        body    : Blob;
        headers : [HeaderField];
        method  : Text;
        url     : Text;
    };

    public type Response = {
        body               : Blob;
        headers            : [HeaderField];
        status_code        : Nat16;
        streaming_strategy : ?StreamingStrategy;
        upgrade            : Bool;
    };

    public type StreamingStrategy = {
        #Callback: {
            callback : StreamingCallback;
            token    : StreamingCallbackToken;
        };
    };

    public type StreamingCallback = query (StreamingCallbackToken) -> async (StreamingCallbackResponse);

    public type StreamingCallbackToken =  {
        content_encoding : Text;
        index            : Nat;
        key              : Text;
    };

    public type StreamingCallbackResponse = {
        body  : Blob;
        token : ?StreamingCallbackToken;
    };
};