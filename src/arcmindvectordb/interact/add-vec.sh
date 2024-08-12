# To deplopy locally; update IC_NETWORK to local. To deploy to ic; update IC_NETWORK to ic.
IC_NETWORK=${IC_NETWORK:-local}

CONTENT_TEXT="$(cat embeddings/investment2-content.txt)"
CONTENT_VECTOR="$(cat embeddings/investment2-vec.txt)"

echo Add embeddings on $IC_NETWORK
echo CONTENT_TEXT=$CONTENT_TEXT
echo CONTENT_VECTOR=$CONTENT_VECTOR
dfx canister call --network $IC_NETWORK arcmindvectordb add "(record {content = \"$CONTENT_TEXT\"; embeddings = vec $CONTENT_VECTOR})"