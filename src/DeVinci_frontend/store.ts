import { writable } from "svelte/store";
import type { Principal } from "@dfinity/principal";
import type { HttpAgent, Identity } from "@dfinity/agent";
import { StoicIdentity } from "ic-stoic-identity";
import { AuthClient } from "@dfinity/auth-client";
import UAParser from 'ua-parser-js';
import {
  DeVinci_backend,
  createActor as createBackendCanisterActor,
  canisterId as backendCanisterId,
  idlFactory as backendIdlFactory,
} from "../declarations/DeVinci_backend";
import {
  arcmindvectordb,
  createActor as createUserKnowledgebaseBackendCanisterActor,
} from "../declarations/arcmindvectordb";

//__________Local vs Mainnet Development____________
/* export const HOST =
  backendCanisterId === "vee64-zyaaa-aaaai-acpta-cai"
    ? "https://ic0.app" // Use in Production (on Mainnet)
    : "http://localhost:4943"; // to be used with http://localhost:4943/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai#/testroom */

export const HOST =
  process.env.NODE_ENV !== "development"
    ? "https://ic0.app"
    : "http://localhost:4943";

// User's device and browser information
export const webGpuSupportedBrowsers = "Google Chrome, Microsoft Edge";
const uaParser = new UAParser();
const result = uaParser.getResult();
export const device = result.device.model || 'Unknown Device';
export let deviceType = result.device.type; // Will return 'mobile' for mobile devices, 'tablet' for tablets, and undefined for desktops
let osName = result.os.name; // Get the operating system name

export const currentModelName = writable<string>("No model selected");

if (!deviceType) {
  deviceType = 'desktop';
} else if (deviceType === 'mobile' || deviceType === 'tablet') {
  if (osName === 'Android') {
    //deviceType = 'Android ' + deviceType; // e.g., 'Android mobile'
    deviceType = 'Android';
  } else if (osName === 'iOS') {
    //deviceType = 'iOS ' + deviceType; // e.g., 'iOS mobile'
    deviceType = 'iOS';
  };
};
export const browser = result.browser.name || 'Unknown Browser';
// @ts-ignore
export const supportsWebGpu = navigator.gpu !== undefined;

export let chatModelGlobal = writable(null);
export let chatModelDownloadedGlobal = writable(false);
export let chatModelIdInitiatedGlobal = writable(null);
export let activeChatGlobal = writable(null);

export const temperatureDefaultSetting = 0.6;
export const responseLengthDefaultSetting = 'Long';
export const systemPromptDefaultSetting = "You are a helpful, respectful and honest assistant.";
export const saveChatsDefaultSetting = true;
export let userSettings = writable(null);
userSettings.subscribe((value) => localStorage.setItem("userSettings", JSON.stringify(value)));
export let selectedAiModelId = writable(localStorage.getItem("selectedAiModelId") || null);
let selectedAiModelIdValue = null;
selectedAiModelId.subscribe((value) => {
  selectedAiModelIdValue = value;
  if (value === null) {
    localStorage.removeItem("selectedAiModelId");
  } else {
    localStorage.setItem("selectedAiModelId", value);
  };
});

export let saveChatsUserSelection = writable(localStorage.getItem("saveChatsUserSelection") === "false" ? false : true); // values: true for "save" or false for "doNotSave" with true as default
let saveChatsUserSelectionValue = saveChatsDefaultSetting;
saveChatsUserSelection.subscribe((value) => {
  saveChatsUserSelectionValue = value;
  // @ts-ignore
  localStorage.setItem("saveChatsUserSelection", value)
});

export let useKnowledgeBase = writable(localStorage.getItem("useKnowledgeBase") === "true" ? true : false);
useKnowledgeBase.subscribe((value) => {
  // @ts-ignore
  localStorage.setItem("useKnowledgeBase", value)
});

export let userKnowledgebaseCanisterAddress = writable(localStorage.getItem("userKnowledgebaseCanisterAddress") || null);
let userKnowledgebaseCanisterAddressValue = localStorage.getItem("userKnowledgebaseCanisterAddress") || null;
userKnowledgebaseCanisterAddress.subscribe((value) => {
  userKnowledgebaseCanisterAddressValue = value;
  localStorage.setItem("userKnowledgebaseCanisterAddress", value)
});
export let userBackendCanisterAddress = writable(localStorage.getItem("userBackendCanisterAddress") || null);
let userBackendCanisterAddressValue = localStorage.getItem("userBackendCanisterAddress") || null;
userBackendCanisterAddress.subscribe((value) => {
  userBackendCanisterAddressValue = value;
  localStorage.setItem("userBackendCanisterAddress", value)
});

export let downloadedModels = writable(JSON.parse(localStorage.getItem("downloadedAiModels") || "[]"));
downloadedModels.subscribe((value) => {
  localStorage.setItem("downloadedAiModels", JSON.stringify(value));
});

export const currentExperienceId = writable(null);
export let vectorStore = writable(null);

export let installAppDeferredPrompt = writable(null); // the installAppDeferredPrompt event cannot be stored across sessions

let authClient : AuthClient;
const APPLICATION_NAME = "DeVinci";
const APPLICATION_LOGO_URL = "https://x6occ-biaaa-aaaai-acqzq-cai.icp0.io/devinci512.png";

const AUTH_PATH = "/authenticate/?applicationName="+APPLICATION_NAME+"&applicationLogo="+APPLICATION_LOGO_URL+"#authorize";

const days = BigInt(30);
const hours = BigInt(24);
const nanosecondsPerHour = BigInt(3600000000000);

type State = {
  isAuthed: "plug" | "stoic" | "nfid" | "bitfinity" | "internetidentity" | null;
  backendActor: typeof DeVinci_backend;
  principal: Principal;
  accountId: string;
  error: string;
  isLoading: boolean;
  userKnowledgebaseCanisterActor: typeof arcmindvectordb;
};

let defaultBackendCanisterId = backendCanisterId;
/* if (userBackendCanisterAddressValue && userBackendCanisterAddressValue !== null && userBackendCanisterAddressValue.length > 5) {
  defaultBackendCanisterId = userBackendCanisterAddressValue;
}; */

const defaultState: State = {
  isAuthed: null,
  backendActor: createBackendCanisterActor(defaultBackendCanisterId, {
    agentOptions: { host: HOST },
  }),
  principal: null,
  accountId: "",
  error: "",
  isLoading: false,
  userKnowledgebaseCanisterActor: null,
};

export const createStore = ({
  whitelist,
  host,
}: {
  whitelist?: string[];
  host?: string;
}) => {
  const { subscribe, update } = writable<State>(defaultState);
  let globalState: State;
  subscribe((value) => globalState = value);

  const initUserSettings = async (backendActor) => {
    // Load the user's settings
      // Especially selected AI model to be used for chat
    if (navigator.onLine) {
      try {
        const retrievedSettingsResponse = await backendActor.get_caller_settings();
        // @ts-ignore
        if (retrievedSettingsResponse.Ok) {
          userSettings.set(retrievedSettingsResponse.Ok);
          const userSelectedAiModelId = retrievedSettingsResponse.Ok.selectedAiModelId;
          selectedAiModelId.set(userSelectedAiModelId);
        } else {
          console.error("Error retrieving user settings: ", retrievedSettingsResponse.Err);
          throw new Error("Error retrieving user settings: ", retrievedSettingsResponse.Err);
        };
      } catch (error) {
        console.error("Error in get_caller_settings: ", error);
        if (localStorage.getItem("userSettings")) {
          try {
            userSettings.set(JSON.parse(localStorage.getItem("userSettings")));            
          } catch (error) {
            userSettings.set({ // default settings
              temperature: temperatureDefaultSetting,
              responseLength: responseLengthDefaultSetting,
              saveChats: saveChatsUserSelectionValue,
              selectedAiModelId: selectedAiModelIdValue,
              systemPrompt: systemPromptDefaultSetting,
            });        
          };
        } else {
          userSettings.set({ // default settings
            temperature: temperatureDefaultSetting,
            responseLength: responseLengthDefaultSetting,
            saveChats: saveChatsUserSelectionValue,
            selectedAiModelId: selectedAiModelIdValue,
            systemPrompt: systemPromptDefaultSetting,
          });
        };
        if (localStorage.getItem("selectedAiModelId")) {
          selectedAiModelId.set(localStorage.getItem("selectedAiModelId"));
        };
      };
    } else {
      if (localStorage.getItem("userSettings")) {
        try {
          userSettings.set(JSON.parse(localStorage.getItem("userSettings")));            
        } catch (error) {
          userSettings.set({ // default settings
            temperature: temperatureDefaultSetting,
            responseLength: responseLengthDefaultSetting,
            saveChats: saveChatsUserSelectionValue,
            selectedAiModelId: selectedAiModelIdValue,
            systemPrompt: systemPromptDefaultSetting,
          });          
        };
      } else {
        userSettings.set({ // default settings
          temperature: temperatureDefaultSetting,
          responseLength: responseLengthDefaultSetting,
          saveChats: saveChatsUserSelectionValue,
          selectedAiModelId: selectedAiModelIdValue,
          systemPrompt: systemPromptDefaultSetting,
        });
      };
      if (localStorage.getItem("selectedAiModelId")) {
        selectedAiModelId.set(localStorage.getItem("selectedAiModelId"));
      };
    };
  };

  const initBackendCanisterActor = async (loginType, identity: Identity) => {
    /* const getUserBackendCanisterId = async (backendActor) => {
      try {
        const canisterEntryResponse = await backendActor.getUserCanistersEntry({ 'canisterType' : { 'Backend' : null } });
        // @ts-ignore
        if (canisterEntryResponse.Ok) {
          // Update backend canister info with user's own canister
          // @ts-ignore
          const userCanisterId = canisterEntryResponse.Ok?.userCanister?.canisterAddress;
          userBackendCanisterAddress.set(userCanisterId);            
          return userCanisterId;
        } else {
          // @ts-ignore
          console.error("Error retrieving user backend canister: ", canisterEntryResponse.Err);
          // @ts-ignore
          throw new Error("Error retrieving user backend canister: ", canisterEntryResponse.Err);
        };
      } catch (error) {
        console.error("Error in getUserBackendCanisterId: ", error);
      };
      return null; // no user backend canister
    }; */

    let canisterId = backendCanisterId;
    /* if (userBackendCanisterAddressValue && userBackendCanisterAddressValue !== null && userBackendCanisterAddressValue.length > 5) {
      canisterId = userBackendCanisterAddressValue;
    }; */
    
    if (loginType === "plug") {
      let backendActor = (await window.ic?.plug.createActor({
        canisterId: canisterId,
        interfaceFactory: backendIdlFactory,
      })) as typeof DeVinci_backend;
      /* if (!userBackendCanisterAddressValue || userBackendCanisterAddressValue === null) {
        // The user might have an own backend canister
        const canisterIdResponse = await getUserBackendCanisterId(backendActor);
        if (canisterIdResponse && canisterIdResponse !== canisterId) {
          canisterId = canisterIdResponse;
          backendActor = (await window.ic?.plug.createActor({
            canisterId: canisterId,
            interfaceFactory: backendIdlFactory,
          })) as typeof DeVinci_backend;
        };
      }; */
      return backendActor;
    } else if (loginType === "bitfinity") {
      let backendActor = (await window.ic?.infinityWallet.createActor({
        canisterId: canisterId,
        interfaceFactory: backendIdlFactory,
        host,
      })) as typeof DeVinci_backend;
      /* if (!userBackendCanisterAddressValue || userBackendCanisterAddressValue === null) {
        // The user might have an own backend canister
        const canisterIdResponse = await getUserBackendCanisterId(backendActor);
        if (canisterIdResponse && canisterIdResponse !== canisterId) {
          canisterId = canisterIdResponse;
          backendActor = (await window.ic?.infinityWallet.createActor({
            canisterId: canisterId,
            interfaceFactory: backendIdlFactory,
            host,
          })) as typeof DeVinci_backend;
        };
      }; */
      return backendActor;
    } else {
      let backendActor = createBackendCanisterActor(canisterId, {
        agentOptions: {
          identity,
          host: HOST,
        },
      });
      /* if (!userBackendCanisterAddressValue || userBackendCanisterAddressValue === null) {
        // The user might have an own backend canister
        const canisterIdResponse = await getUserBackendCanisterId(backendActor);
        if (canisterIdResponse && canisterIdResponse !== canisterId) {
          canisterId = canisterIdResponse;
          backendActor = createBackendCanisterActor(canisterId, {
            agentOptions: {
              identity,
              host: HOST,
            },
          });
        };
      }; */
      return backendActor;
    };
  };

  const updateBackendCanisterActor = async (newBackendCanisterId) => {
    if (!newBackendCanisterId) {
      return;
    }
    if (authClient) {
      const identity = await authClient.getIdentity();
      let backendActor;
      if (globalState.isAuthed === "plug") {
        backendActor = (await window.ic?.plug.createActor({
          canisterId: newBackendCanisterId,
          interfaceFactory: backendIdlFactory,
        })) as typeof DeVinci_backend;
      } else if (globalState.isAuthed === "bitfinity") {
        backendActor = (await window.ic?.infinityWallet.createActor({
          canisterId: newBackendCanisterId,
          interfaceFactory: backendIdlFactory,
          host,
        })) as typeof DeVinci_backend;
      } else {
        backendActor = createBackendCanisterActor(newBackendCanisterId, {
          agentOptions: {
            identity,
            host: HOST,
          },
        });
      };
      if (backendActor) {
        update((state) => {
          return {
            ...state,
            backendActor,
          };
        });
      };
      return backendActor;
    };
    return null; 
  };

  const nfidConnect = async () => {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const identity = await authClient.getIdentity();
      initNfid(identity);
    } else {
      await authClient.login({
        onSuccess: async () => {
          const identity = await authClient.getIdentity();
          initNfid(identity);
        },
        identityProvider: "https://nfid.one" + AUTH_PATH,
          /* process.env.DFX_NETWORK === "ic"
            ? "https://nfid.one" + AUTH_PATH
            : process.env.LOCAL_NFID_CANISTER + AUTH_PATH, */
        // Maximum authorization expiration is 30 days
        maxTimeToLive: days * hours * nanosecondsPerHour,
        windowOpenerFeatures:
          `left=${window.screen.width / 2 - 525 / 2}, `+
          `top=${window.screen.height / 2 - 705 / 2},` +
          `toolbar=0,location=0,menubar=0,width=525,height=705`,
        // See https://docs.nfid.one/multiple-domains
        // for instructions on how to use derivationOrigin
        // derivationOrigin: "https://<canister_id>.ic0.app"
      });
    };
  };

  const initNfid = async (identity: Identity) => {
    const backendActor = await initBackendCanisterActor("nfid", identity);

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    await initUserSettings(backendActor);

    //let accounts = JSON.parse(await identity.accounts());

    localStorage.setItem('isAuthed', "nfid"); // Set flag to indicate existing login for future sessions

    update((state) => ({
      ...state,
      backendActor,
      principal: identity.getPrincipal(),
      //accountId: accounts[0].address, // we take the default account associated with the identity
      accountId: null,
      isAuthed: "nfid",
    }));

    console.info("nfid is authed");
  };

  const internetIdentityConnect = async () => {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const identity = await authClient.getIdentity();
      initInternetIdentity(identity);
    } else {
      await authClient.login({
        onSuccess: async () => {
          const identity = await authClient.getIdentity();
          initInternetIdentity(identity);
        },
        identityProvider:
          process.env.DFX_NETWORK === "local"
            ? `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943/#authorize`
            : "https://identity.ic0.app/#authorize",
        // Maximum authorization expiration is 30 days
        maxTimeToLive: days * hours * nanosecondsPerHour,
        windowOpenerFeatures:
          `left=${window.screen.width / 2 - 525 / 2}, ` +
          `top=${window.screen.height / 2 - 705 / 2},` +
          `toolbar=0,location=0,menubar=0,width=525,height=705`,
      });
    };
  };

  const initInternetIdentity = async (identity: Identity) => {
    const backendActor = await initBackendCanisterActor("internetidentity", identity);

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    await initUserSettings(backendActor);

    //let accounts = JSON.parse(await identity.accounts());

    localStorage.setItem('isAuthed', "internetidentity"); // Set flag to indicate existing login for future sessions

    update((state) => ({
      ...state,
      backendActor,
      principal: identity.getPrincipal(),
      //accountId: accounts[0].address, // we take the default account associated with the identity
      accountId: null,
      isAuthed: "internetidentity",
    }));

    console.info("internetidentity is authed");
  };

  const stoicConnect = () => {
    StoicIdentity.load().then(async (identity) => {
      if (identity !== false) {
        // ID is a already connected wallet!
      } else {
        // No existing connection, lets make one!
        identity = await StoicIdentity.connect();
      }
      initStoic(identity);
    });
  };

  const initStoic = async (identity: Identity & { accounts(): string }) => {
    const backendActor = await initBackendCanisterActor("stoic", identity);

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    await initUserSettings(backendActor);

    // the stoic agent provides an `accounts()` method that returns accounts associated with the principal
    let accounts = JSON.parse(await identity.accounts());

    localStorage.setItem('isAuthed', "stoic"); // Set flag to indicate existing login for future sessions

    update((state) => ({
      ...state,
      backendActor,
      principal: identity.getPrincipal(),
      accountId: accounts[0].address, // we take the default account associated with the identity
      isAuthed: "stoic",
    }));

    console.info("stoic is authed");
  };

  const plugConnect = async () => {
    // check if plug is installed in the browser
    if (window.ic?.plug === undefined) {
      window.open("https://plugwallet.ooo/", "_blank");
      return;
    };

    // check if plug is connected
    const plugConnected = await window.ic?.plug?.isConnected();
    if (!plugConnected) {
      try {
        console.info({
          whitelist,
          host,
        });
        await window.ic?.plug.requestConnect({
          whitelist,
          host,
        });
        console.info("plug connected");
      } catch (e) {
        console.warn(e);
        return;
      };
    };

    await initPlug();
  };

  const initPlug = async () => {
    // check whether agent is present
    // if not create it
    if (!window.ic?.plug?.agent) {
      console.warn("no agent found");
      const result = await window.ic?.plug?.createAgent({
        whitelist,
        host,
      });
      result
        ? console.info("agent created")
        : console.warn("agent creation failed");
    };
    // check if createActor method is available
    if (!window.ic?.plug?.createActor) {
      console.warn("no createActor found");
      return;
    }

    // Fetch root key for certificate validation during development
    if (process.env.DFX_NETWORK !== "ic") {
      window.ic.plug.agent.fetchRootKey().catch((err) => {
        console.warn(
          "Unable to fetch root key. Check to ensure that your local replica is running",
        );
        console.error(err);
      });
    };

    const backendActor = await initBackendCanisterActor("plug", null);

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    await initUserSettings(backendActor);

    const principal = await window.ic.plug.agent.getPrincipal();

    localStorage.setItem('isAuthed', "plug"); // Set flag to indicate existing login for future sessions

    update((state) => ({
      ...state,
      backendActor,
      principal,
      accountId: window.ic.plug.sessionManager.sessionData.accountId,
      isAuthed: "plug",
    }));

    console.info("plug is authed");
  };

  const bitfinityConnect = async () => {
    // check if Bitfinity is installed in the browser
    if (window.ic?.infinityWallet === undefined) {
      window.open("https://wallet.bitfinity.network/", "_blank");
      return;
    };

    // check if bitfinity is connected
    const bitfinityConnected = await window.ic?.infinityWallet?.isConnected();
    if (!bitfinityConnected) {
      try {
        console.info({
          whitelist,
          host,
        });
        await window.ic?.infinityWallet.requestConnect({
          whitelist,
          //host,
        });
      } catch (e) {
        console.warn(e);
        return;
      };
    };

    await initBitfinity();
  };

  const initBitfinity = async () => {
    // check whether agent is present
    // if not create it
    /* if (!window.ic?.infinityWallet?.agent) {
      console.warn("no agent found");
      const result = await window.ic?.infinityWallet?.createAgent({
        whitelist,
        host,
      });
      result
        ? console.info("agent created")
        : console.warn("agent creation failed");
    }; */
    // check if createActor method is available
    if (!window.ic?.infinityWallet?.createActor) {
      console.warn("no createActor found");
      return;
    };

    // Fetch root key for certificate validation during development
    if (process.env.DFX_NETWORK === "local") {
      /* window.ic.infinityWallet.agent.fetchRootKey().catch((err) => {
        console.warn(
          "Unable to fetch root key. Check to ensure that your local replica is running",
        );
        console.error(err);
      }); */
    }

    const backendActor = await initBackendCanisterActor("bitfinity", null);

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    const principal = await window.ic.infinityWallet.getPrincipal();

    localStorage.setItem('isAuthed', "bitfinity"); // Set flag to indicate existing login for future sessions

    update((state) => ({
      ...state,
      backendActor,
      principal,
      //accountId: window.ic.infinityWallet.sessionManager.sessionData.accountId,
      isAuthed: "bitfinity",
    }));

    console.info("bitfinity is authed");
  };

  const disconnect = async () => {
    // Check isAuthed to determine which method to use to disconnect
    if (globalState.isAuthed === "plug") {
      try {
        await window.ic?.plug?.disconnect();
        // wait for 500ms to ensure that the disconnection is complete
        await new Promise((resolve) => setTimeout(resolve, 500));
        const plugConnected = await window.ic?.plug?.isConnected();
        if (plugConnected) {
          console.info("plug disconnect failed, trying once more");
          await window.ic?.plug?.disconnect();
        };
      } catch (error) {
        console.error("Plug disconnect error: ", error);
      };
    } else if (globalState.isAuthed === "stoic") {
      try {
        StoicIdentity.disconnect();
      } catch (error) {
        console.error("StoicIdentity disconnect error: ", error);
      };
    } else if (globalState.isAuthed === "nfid") {
      try {
        await authClient.logout();
      } catch (error) {
        console.error("NFid disconnect error: ", error);
      };
    } else if (globalState.isAuthed === "internetidentity") {
      try {
        await authClient.logout();
      } catch (error) {
        console.error("Internet Identity disconnect error: ", error);
      };
    } else if (globalState.isAuthed === "bitfinity") {
      /* try {
        await window.ic?.infinityWallet?.disconnect();
        // wait for 500ms to ensure that the disconnection is complete
        await new Promise((resolve) => setTimeout(resolve, 500));
        const bitfinityConnected = await window.ic?.infinityWallet?.isConnected();
        if (bitfinityConnected) {
          console.info("Bitfinity disconnect failed, trying once more");
          await window.ic?.infinityWallet?.disconnect();
        };
      } catch (error) {
        console.error("Bitfinity disconnect error: ", error);
      }; */
    };

    update((prevState) => {
      return {
        ...defaultState,
      };
    });
  };

  const checkExistingLoginAndConnect = async () => {
    // Check login state if user is already logged in
    const isAuthed = localStorage.getItem('isAuthed'); // Accessing Local Storage to check login state
    if (isAuthed) {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        if (isAuthed === "nfid") {
          console.info("NFID connection detected");
          nfidConnect();
        } else if (isAuthed === "internetidentity") {
          console.info("Internet Identity connection detected");
          internetIdentityConnect();
        } else if (isAuthed === "plug") {
          console.info("Plug connection detected");
          plugConnect();
        } else if (isAuthed === "bitfinity") {
          console.info("Bitfinity connection detected");
          bitfinityConnect();
        } else if (isAuthed === "stoic") {
          console.info("Stoic connection detected");
          stoicConnect();
        };
      };
    };
  };

  const getActorForUserKnowledgebaseCanister = async () => {
    if (globalState.userKnowledgebaseCanisterActor) {
      return globalState.userKnowledgebaseCanisterActor;
    };
    if (authClient) {
      const identity = await authClient.getIdentity();

      if (!userKnowledgebaseCanisterAddressValue) {
        try {
          const canisterEntryResponse = await globalState.backendActor.getUserCanistersEntry({ 'canisterType' : { 'Knowledgebase' : null } });
          // @ts-ignore
          if (canisterEntryResponse.Ok) {
            // @ts-ignore
            userKnowledgebaseCanisterAddress.set(canisterEntryResponse.Ok?.userCanister?.canisterAddress);
          } else {
            // @ts-ignore
            console.error("Error retrieving user knowledgebase canister: ", canisterEntryResponse.Err);
            // @ts-ignore
            throw new Error("Error retrieving user knowledgebase canister: ", canisterEntryResponse.Err);
          };
        } catch (error) {
          console.error("Error in getActorForUserKnowledgebaseCanister: ", error);
          return null;
        };
      };

      const userKnowledgebaseCanisterActor = createUserKnowledgebaseBackendCanisterActor(userKnowledgebaseCanisterAddressValue, {
        agentOptions: {
          identity,
          host: HOST,
        },
      });
      update((state) => {
        return {
          ...state,
          userKnowledgebaseCanisterActor,
        };
      });
      return userKnowledgebaseCanisterActor;
    };
    return null;    
  };

  return {
    subscribe,
    update,
    plugConnect,
    stoicConnect,
    nfidConnect,
    bitfinityConnect,
    internetIdentityConnect,
    disconnect,
    checkExistingLoginAndConnect,
    getActorForUserKnowledgebaseCanister,
    updateBackendCanisterActor,
  };
};

export const store = createStore({
  whitelist: [backendCanisterId],
  host: HOST,
});

declare global {
  interface Window {
    ic: {
      plug: {
        agent: HttpAgent;
        sessionManager: {
          sessionData: {
            accountId: string;
          };
        };
        getPrincipal: () => Promise<Principal>;
        deleteAgent: () => void;
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
        }) => Promise<any>;
        createActor: (options: {}) => Promise<typeof DeVinci_backend>;
        isConnected: () => Promise<boolean>;
        disconnect: () => Promise<boolean>;
        createAgent: (args?: {
          whitelist: string[];
          host?: string;
        }) => Promise<undefined>;
        requestBalance: () => Promise<
          Array<{
            amount: number;
            canisterId: string | null;
            image: string;
            name: string;
            symbol: string;
            value: number | null;
          }>
        >;
        requestTransfer: (arg: {
          to: string;
          amount: number;
          opts?: {
            fee?: number;
            memo?: string;
            from_subaccount?: number;
            created_at_time?: {
              timestamp_nanos: number;
            };
          };
        }) => Promise<{ height: number }>;
      };
      infinityWallet: {
        /* agent: HttpAgent;
        sessionManager: {
          sessionData: {
            accountId: string;
          };
        }; */
        getPrincipal: () => Promise<Principal>;
        //deleteAgent: () => void;
        requestConnect: (options?: {
          whitelist?: string[];
          //host?: string;
        }) => Promise<any>;
        createActor: (options: {
          canisterId: string;
          interfaceFactory: any;
          host?: string;
        }) => Promise<typeof DeVinci_backend>;
        isConnected: () => Promise<boolean>;
        /* disconnect: () => Promise<boolean>;
        createAgent: (args?: {
          whitelist: string[];
          host?: string;
        }) => Promise<undefined>;
        requestBalance: () => Promise<
          Array<{
            amount: number;
            canisterId: string | null;
            image: string;
            name: string;
            symbol: string;
            value: number | null;
          }>
        >;
        requestTransfer: (arg: {
          to: string;
          amount: number;
          opts?: {
            fee?: number;
            memo?: string;
            from_subaccount?: number;
            created_at_time?: {
              timestamp_nanos: number;
            };
          };
        }) => Promise<{ height: number }>; */
        getUserAssets: () => Promise<any>;
        batchTransactions: () => Promise<any>;
      };
    };
  }
}
