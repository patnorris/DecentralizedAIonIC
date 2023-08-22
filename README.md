# DeVinci

## Try DeVinci
DeVinci is live on the Internet Computer. If you like, you can give it a try here:
https://x6occ-biaaa-aaaai-acqzq-cai.icp0.io/
Note: currently, only Chrome and Edge on desktop support the required features. Other devices, including smartphones, and other browsers cannot run it (for now :) ).

Do you have any feedback? We'd love to hear it!
You can open an issue on GitHub or share your thoughts on this forum post: https://forum.dfinity.org/t/browser-based-ai-chatbot-served-from-the-ic/22263 Thank you!

## Internet Computer Resources

Welcome to your new DeVinci project and to the internet computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with DeVinci, see the following documentation available online:

- [Quick Start](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html)
- [SDK Developer Tools](https://sdk.dfinity.org/docs/developers-guide/sdk-guide.html)
- [Motoko Programming Language Guide](https://sdk.dfinity.org/docs/language-guide/motoko.html)
- [Motoko Language Quick Reference](https://sdk.dfinity.org/docs/language-guide/language-manual.html)
- [JavaScript API Reference](https://erxue-5aaaa-aaaab-qaagq-cai.raw.ic0.app)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd DeVinciSvelte/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash

# 1. Install dependencies
npm install

# 2. Install Vessel which is a dependency
https://github.com/dfinity/vessel:

npm run dev
Note: this starts a replica which includes the canisters state stored from previous sessions.
If you want to start a clean local IC replica (i.e. all canister state is erased) run instead: npm run erase-replica

# 3. Deploys your canisters to the replica and generates your candid interface
Local:
dfx deploy vetkd_system_api
dfx deploy --argument "( principal\"$(dfx identity get-principal)\" )" DeVinci_backend
dfx deploy DeVinci_frontend

# Alternative 3. Run a local vite UI (note that this had issues communicating to the backend canister for some setups in the past)
npm run vite
--> runs on port 3000
access routes like "http://172.30.141.44:3000/#/testroom" (same as on Mainnet)
hot reloads with every UI change

# Development Canisters on Mainnet
dfx deploy --network development vetkd_system_api
dfx deploy --network development --argument "( principal\"$(dfx identity get-principal)\" )" DeVinci_backend
dfx deploy --network development DeVinci_frontend

# Production Deployment
npm install

dfx start --background

Deploy to Mainnet (live IC):
Ensure that all changes needed for Mainnet deployment have been made (e.g. define HOST in store.ts)

dfx deploy --network ic vetkd_system_api
dfx deploy --network ic --argument "( principal\"$(dfx identity get-principal)\" )" DeVinci_backend
dfx deploy --network ic DeVinci_frontend

In case there are authentication issues, you could try this command
Note that only authorized identities which are set up as canister controllers may deploy the production canisters

dfx deploy --network ic --wallet "$(dfx identity --network ic get-wallet)"

# Get and delete Email Subscribers
dfx canister call DeVinci_backend get_email_subscribers
dfx canister call DeVinci_backend delete_email_subscriber 'j@g.com'

dfx canister call DeVinci_backend get_email_subscribers --network development
dfx canister call DeVinci_backend delete_email_subscriber 'j@g.com' --network development

dfx canister call DeVinci_backend get_email_subscribers --network ic
dfx canister call DeVinci_backend delete_email_subscriber 'j@g.com' --network ic

# Cycles for Production Canisters
Fund wallet with cycles (from ICP): https://medium.com/dfinity/internet-computer-basics-part-3-funding-a-cycles-wallet-a724efebd111

Top up cycles:
dfx identity --network=ic get-wallet
dfx wallet --network ic balance
dfx canister --network ic status DeVinci_backend
dfx canister --network ic status DeVinci_frontend
dfx canister --network ic --wallet 3v5vy-2aaaa-aaaai-aapla-cai deposit-cycles 3000000000000 DeVinci_backend
dfx canister --network ic --wallet 3v5vy-2aaaa-aaaai-aapla-cai deposit-cycles 300000000000 DeVinci_frontend

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`NODE_ENV` to `production` if you are using Webpack
- use your own preferred method to replace `process.env.NODE_ENV` in the autogenerated declarations
- Write your own `createActor` constructor
