#!/bin/bash

CONTROLLER_PRINCIPAL=cda4n-7jjpo-s4eus-yjvy7-o6qjc-vrueo-xd2hh-lh5v2-k7fpf-hwu5o-yqe
BATTERY_API_KEY="1"
BATTERY_PRINCIPAL=cda4n-7jjpo-s4eus-yjvy7-o6qjc-vrueo-xd2hh-lh5v2-k7fpf-hwu5o-yqe
IC_NETWORK=local

# Validate required env vars
if [[ -z "${CONTROLLER_PRINCIPAL}" ]]; then
  echo "CONTROLLER_PRINCIPAL is unset."
  exit 1
fi

if [[ -z "${BATTERY_PRINCIPAL}" ]]; then
  echo "BATTERY_PRINCIPAL is unset."
  exit 1
fi

if [[ -z "${BATTERY_API_KEY}" ]]; then
  echo "BATTERY_API_KEY is unset."
  exit 1
fi

# To deplopy locally, update IC_NETWORK to local. To deploy to ic, update IC_NETWORK to ic.
IC_NETWORK=${IC_NETWORK:-local}

# Deploy vectordb canister 
# NOTES - DO NOT echo other content as it will becomes the input of parent script in arcmindai provision-instance.sh
dfx deploy --network $IC_NETWORK arcmindvectordb --argument "(opt principal \"$CONTROLLER_PRINCIPAL\", opt \"$BATTERY_API_KEY\", opt principal \"$BATTERY_PRINCIPAL\")" > arcmindvectordb_deploy.txt

VECTOR_PRINCIPAL=$(dfx canister --network $IC_NETWORK id arcmindvectordb)
echo $VECTOR_PRINCIPAL
