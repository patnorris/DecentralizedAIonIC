# To deplopy locally; update IC_NETWORK to local. To deploy to ic; update IC_NETWORK to ic.

CONTENT_TEXT="$(cat embeddings/investment2-content.txt)"
CONTENT_VECTOR="$(cat embeddings/investment2-vec.txt)"

echo CONTENT_TEXT=$CONTENT_TEXT
echo CONTENT_VECTOR=$CONTENT_VECTOR
dfx canister call --network development arcmindvectordb add "(record {content = \"$CONTENT_TEXT\"; embeddings = vec $CONTENT_VECTOR})"