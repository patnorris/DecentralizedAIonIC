# DeVinci

## Try DeVinci
DeVinci is live on the Internet Computer. If you like, you can give it a try [here](https://x6occ-biaaa-aaaai-acqzq-cai.icp0.io/).

**Notes**:
- Currently, only Chrome and Edge on desktop support the required features (WebGPU). Other devices, including smartphones, and other browsers, cannot run it (for now). 
- AI models are pretty huge and require quite some computational resources. As DeVinci runs on the user's device (via the browser), whether and how fast it may run depend on the device's hardware. If a given model doesn't work, the user can thus try a smaller one and see if the device can support it.
- For the best possible experience, we recommend running as few other programs and browser tabs as possible besides DeVinci as those can limit the computational resources available for DeVinci.

Do you have any feedback? We'd love to hear it! You can open an issue on GitHub or share your thoughts on this [forum post](https://forum.dfinity.org/t/browser-based-ai-chatbot-served-from-the-ic/22263). Thank you!

## About DeVinci

DeVinci is the personalized AI assistant that redefines the paradigm of digital privacy and trust. It's decentralized, trusted, open-source, and truly user-focused. Powered by an open-source AI model that runs directly within the browser, the interactions with DeVinci happen on the user's device, giving users unprecedented control.

### Key Features
- **Decentralized**: Operates directly within the browser. Users can choose if they want to log in and store their chats on the decentralized cloud and under their control.
- **Trusted**: No corporation behind, just an AI serving the user.
- **Open-source**: Built on open-source software (notably Web LLM and Internet Computer).
- **Personalized**: Users engage in meaningful conversations and ask questions, all while ensuring their privacy.

### How DeVinci Works
DeVinci comprises a frontend canister which integrates the AI model and a backend canister for optional chat history storage. Here's a glimpse of how DeVinci is structured:

#### Frontend Canister
The frontend canister serves the user interface, including HTML, CSS, and JavaScript files. It leverages the Web LLM npm library to wrap the AI model into the DeVinci chat app.

#### Web LLM
The open-source project Web LLM allows us to load and interact with open-source AI models. The selected model is loaded and cached into the browser and runs directly there, thus on the user's device. That way all interactions and data may stay local to the device. This significantly improves privacy and control over user data.

#### Backend Canister
The backend canister enables users to persist their chats and to store any other user data (e.g. settings) if they choose to (DeVinci can be used without logging in and even when logged in users have the choice whether they want their chats to be stored). All of this is achieved in a decentralized manner through the Internet Computer, ensuring high availability and scalability.

## Internet Computer Resources

DeVinci is built and hosted on the Internet Computer. To learn more about it, see the following documentation available online:

- [Quick Start](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html)
- [SDK Developer Tools](https://sdk.dfinity.org/docs/developers-guide/sdk-guide.html)
- [Motoko Programming Language Guide](https://sdk.dfinity.org/docs/language-guide/motoko.html)
- [Motoko Language Quick Reference](https://sdk.dfinity.org/docs/language-guide/language-manual.html)
- [JavaScript API Reference](https://erxue-5aaaa-aaaab-qaagq-cai.raw.ic0.app)

## Running the project locally

If you want to run this project locally, you can use the following commands:

### 1. Install dependencies
```bash
npm install
```
### 2. Install Vessel which is a dependency
https://github.com/dfinity/vessel

### 3. Start a local replica
```bash
npm run dev
```
Note: this starts a local replica of the Internet Computer (IC) which includes the canisters state stored from previous sessions.
If you want to start a clean local IC replica (i.e. all canister state is erased) run instead:
```bash
npm run erase-replica
```

### 4. Deploy your canisters to the replica
Local:
```bash
dfx deploy --argument "( principal\"$(dfx identity get-principal)\" )" DeVinci_backend --network local
dfx deploy internet_identity --network local
dfx deploy DeVinci_frontend --network local
```
Alternative: Run a local vite UI (note that this had issues communicating to the backend canister for some setups in the past)
```bash
npm run vite
```
--> runs on port 3000
Access routes like "http://172.30.141.44:3000/#/mychats" (same as on Mainnet)
Hot reloads with every UI change

## Deployment to the Internet Computer mainnet
Deploy the code as canisters to the live IC where it's accessible via regular Web browsers.

### Development Stage
```bash
dfx deploy --network development --argument "( principal\"$(dfx identity get-principal)\" )" DeVinci_backend
dfx deploy --network development DeVinci_frontend
```

### Testing Stage
```bash
dfx deploy --network testing --argument "( principal\"$(dfx identity get-principal)\" )" DeVinci_backend
dfx deploy --network testing DeVinci_frontend
```
For setting up stages, see [Notes on Stages](./notes/NotesOnStages.md)

### Production Deployment
```bash
npm install

dfx start --background
```
Deploy to Mainnet (live IC):
Ensure that all changes needed for Mainnet deployment have been made (e.g. define HOST in store.ts)
```bash
dfx deploy --network ic --argument "( principal\"$(dfx identity get-principal)\" )" DeVinci_backend
dfx deploy --network ic DeVinci_frontend
```
In case there are authentication issues, you could try this command
(Note that only authorized identities which are set up as canister controllers may deploy the production canisters)
```bash
dfx deploy --network ic --wallet "$(dfx identity --network ic get-wallet)"
```

# Credits
Running DeVinci in your browser is enabled by the great open-source project [Web LLM](https://webllm.mlc.ai/)

Serving this app and hosting the data securely and in a decentralized way is made possible by the [Internet Computer](https://internetcomputer.org/)

# Other
## Get and delete Email Subscribers
The project has email subscription functionality included. The following commands are helpful for managing subscriptions.
```bash
dfx canister call DeVinci_backend get_email_subscribers
dfx canister call DeVinci_backend delete_email_subscriber 'j@g.com'

dfx canister call DeVinci_backend get_email_subscribers --network development
dfx canister call DeVinci_backend delete_email_subscriber 'j@g.com' --network development

dfx canister call DeVinci_backend get_email_subscribers --network ic
dfx canister call DeVinci_backend delete_email_subscriber 'j@g.com' --network ic
```

## Cycles for Production Canisters
Due to the IC's reverse gas model, developers charge their canisters with cycles to pay for any used computational resources. The following can help with managing these cycles.

Fund wallet with cycles (from ICP): https://medium.com/dfinity/internet-computer-basics-part-3-funding-a-cycles-wallet-a724efebd111

Top up cycles:
```bash
dfx identity --network=ic get-wallet
dfx wallet --network ic balance
dfx canister --network ic status DeVinci_backend
dfx canister --network ic status DeVinci_frontend
dfx canister --network ic --wallet 3v5vy-2aaaa-aaaai-aapla-cai deposit-cycles 3000000000000 DeVinci_backend
dfx canister --network ic --wallet 3v5vy-2aaaa-aaaai-aapla-cai deposit-cycles 300000000000 DeVinci_frontend
```