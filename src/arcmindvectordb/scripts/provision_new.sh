#!/bin/bash

# Deploy vectordb canister 
# NOTES - DO NOT echo other content as it will becomes the input of parent script in arcmindai provision-instance.sh
dfx deploy arcmindvectordb > arcmindvectordb_deploy.txt
