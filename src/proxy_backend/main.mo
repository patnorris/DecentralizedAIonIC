import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Text "mo:base/Text";
import Nat16 "mo:base/Nat16";
import Array "mo:base/Array";
import Error "mo:base/Error";

import Types "Types";

import Server "mo:server";

shared ({ caller = creator }) actor class () {
    stable var serializedEntries : Server.SerializedEntries = ([], [], [creator]);

    var server = Server.Server({ serializedEntries });


    public func proxy(url : Text) : async Types.CanisterHttpResponsePayload {

        let transform_context : Types.TransformContext = {
            function = transform;
            context = Blob.fromArray([]);
        };

        // Construct canister request
        let request : Types.CanisterHttpRequestArgs = {
            url = url;
            max_response_bytes = null;
            headers = [{ name = "Accept"; value = "text/plain"; }];
            body = null;
            method = #get;
            transform = ?transform_context;
        };
        Cycles.add(100_000_000_000); // TODO: potentially decrease
        let ic : Types.IC = actor ("aaaaa-aa");
        try {
            let response : Types.CanisterHttpResponsePayload = await ic.http_request(request);
            response;
        }
        catch e {
            return {
                status = 500;
                headers = [];
                body = [];
            };
        };
    };

    public query func transform(raw : Types.TransformArgs) : async Types.CanisterHttpResponsePayload {
        let transformed : Types.CanisterHttpResponsePayload = {
            status = raw.response.status;
            body = raw.response.body;
            headers = [
                {
                name = "Content-Security-Policy";
                value = "default-src 'self'";
                },
                { name = "Referrer-Policy"; value = "strict-origin" },
                { name = "Permissions-Policy"; value = "geolocation=(self)" },
                {
                name = "Strict-Transport-Security";
                value = "max-age=63072000";
                },
                { name = "X-Frame-Options"; value = "DENY" },
                { name = "X-Content-Type-Options"; value = "nosniff" },
            ];
        };
        transformed;
    };

// TODO: incorporate async requests
    // https://github.com/krpeacock/server/blob/main/src/lib.mo#L124
    /* type Request = Server.Request;
    type Response = Server.Response;

    server.get("/proxy", func (req : Request, res : Server.ResponseClass) : Response {
        if (req.url.original == "ping") {
            res.json({
                status_code = 200;
                body = "{ \"hello\": \"world\" }";
                cache_strategy = #default;
            });
        } else {
            let proxyResponse = await proxy(req.url.original);
            let response : Response = {
                status_code = proxyResponse.status;
                body = proxyResponse.body;
                cache_strategy = #default;
            };
            res.json(response);
        };
    }); */

    /*
     * http request hooks
     */
    public query func http_request(req : Server.HttpRequest) : async Server.HttpResponse {
        //server.http_request(req);
        return {
            upgrade = ?true; // ← If this is set to true, the request will be sent to http_request_update()
            status_code = 200;
            headers = [ ("content-type", "text/plain") ];
            body = "Upgrade to Update Request and let http_request_update handle it";
            streaming_strategy = null;
        };
    };
    public func http_request_update(req : Server.HttpRequest) : async Server.HttpResponse {
        //server.http_request_update(req);
        /* return {
            upgrade = ?false; // ← If this is set to true, the request will be sent to http_request_update()
            status_code = 200;
            headers = [ ("content-type", "text/plain") ];
            body = Text.encodeUtf8(req.url);
            streaming_strategy = null;
        }; */
        try {
            //let proxyResponse = await proxy(req.url);
            let proxyResponse = await proxy("https://bbc.com/");
            let headersToReturn : [(Text, Text)] = Array.map<Types.HttpHeader, (Text, Text)>(proxyResponse.headers, func h = (h.name, h.value));
            let response : Server.HttpResponse = {
                status_code = Nat16.fromNat(proxyResponse.status);
                headers = headersToReturn;
                body = Blob.fromArray(proxyResponse.body);
                streaming_strategy = null;
                upgrade = ?false;
            };
            return response;
        }
        catch e {
            return {
                upgrade = ?false; // ← If this is set to true, the request will be sent to http_request_update()
                status_code = 500;
                headers = [ ("content-type", "text/plain") ];
                body = Text.encodeUtf8(Error.message(e));
                streaming_strategy = null;
            };
        };
    };

    /*
     * upgrade hooks
     */
    system func preupgrade() {
        serializedEntries := server.entries();
    };

    system func postupgrade() {
        ignore server.cache.pruneAll();
    };
};