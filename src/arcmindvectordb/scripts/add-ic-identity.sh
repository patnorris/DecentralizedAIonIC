#!/bin/bash

## Require ENV VARS: DFX_IDENTITY and DFX_WALLETS
# See https://github.com/FleekHQ/IC-Deploy-Action for original reference

echo Create DFX identity directory
mkdir ~/.config
mkdir ~/.config/dfx
mkdir ~/.config/dfx/identity
mkdir ~/.config/dfx/identity/default

echo Add DFX identity and wallets from ENV VARS
echo $DFX_IDENTITY > ~/.config/dfx/identity/default/identity.pem
sed -i 's/\\r\\n/\r\n/g' ~/.config/dfx/identity/default/identity.pem
echo $DFX_WALLETS > ~/.config/dfx/identity/default/wallets.json
