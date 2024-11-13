# To deplopy locally; update IC_NETWORK to local. To deploy to ic; update IC_NETWORK to ic.

CONTENT_VECTOR="$(cat embeddings/gc-weather-vec.txt)"

dfx canister call --network development arcmindvectordb search "(variant { Embeddings = vec $CONTENT_VECTOR }, 2)"