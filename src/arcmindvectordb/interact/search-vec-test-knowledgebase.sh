# To deplopy locally; update IC_NETWORK to local. To deploy to ic; update IC_NETWORK to ic.

CONTENT_VECTOR="$(cat embeddings/investment2-vec.txt)"

dfx canister call --network local b77ix-eeaaa-aaaaa-qaada-cai search "(variant { Embeddings = vec $CONTENT_VECTOR }, 2)"