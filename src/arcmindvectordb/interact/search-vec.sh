# To deplopy locally; update IC_NETWORK to local. To deploy to ic; update IC_NETWORK to ic.
IC_NETWORK=${IC_NETWORK:-local}

CONTENT_VECTOR="$(cat embeddings/gc-weather-vec.txt)"

echo Search similar vectors on $IC_NETWORK
dfx canister call --network $IC_NETWORK arcmindvectordb search "(variant { Embeddings = vec $CONTENT_VECTOR }, 2)"