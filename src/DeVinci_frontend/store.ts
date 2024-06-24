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
import { getDefaultAiModelId } from "./helpers/ai_model_helpers";

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
export let activeChatGlobal = writable(null);
export let selectedAiModelId = writable(getDefaultAiModelId(deviceType === 'Android'));

export let vectorStore = writable(null);

let authClient : AuthClient;
const APPLICATION_NAME = "DeVinci";
const APPLICATION_LOGO_URL = "https://vdfyi-uaaaa-aaaai-acptq-cai.ic0.app/favicon.ico"; //TODO: change to faviconFutureWebInitiative (once deployed with OIM)
//"https%3A%2F%2Fx6occ%2Dbiaaa%2Daaaai%2Dacqzq%2Dcai.icp0.io%2Ffavicon.ico"
//"https%3A%2F%2Fx6occ-biaaa-aaaai-acqzq-cai.icp0.io%2FFutureWebInitiative%5Fimg.png";
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
};

const defaultState: State = {
  isAuthed: null,
  backendActor: createBackendCanisterActor(backendCanisterId, {
    agentOptions: { host: HOST },
  }),
  principal: null,
  accountId: "",
  error: "",
  isLoading: false,
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
    const retrievedSettingsResponse = await backendActor.get_caller_settings();
    let userSettings;
    // @ts-ignore
    if (retrievedSettingsResponse.Ok) {
      // @ts-ignore
      userSettings = retrievedSettingsResponse.Ok;
      const userSelectedAiModelId = userSettings.selectedAiModelId;
      selectedAiModelId.set(userSelectedAiModelId);
    } else {
      console.error("Error retrieving user settings: ", retrievedSettingsResponse.Err);
    };
  };

  const nfidConnect = async () => {
    authClient = await AuthClient.create();
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

  const initNfid = async (identity: Identity) => {
    const backendActor = createBackendCanisterActor(backendCanisterId, {
      agentOptions: {
        identity,
        host: HOST,
      },
    });

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    await initUserSettings(backendActor);

    //let accounts = JSON.parse(await identity.accounts());

    update((state) => ({
      ...state,
      backendActor,
      principal: identity.getPrincipal(),
      //accountId: accounts[0].address, // we take the default account associated with the identity
      accountId: null,
      isAuthed: "nfid",
    }));
  };

  const internetIdentityConnect = async () => {
    authClient = await AuthClient.create();
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
        `left=${window.screen.width / 2 - 525 / 2}, `+
        `top=${window.screen.height / 2 - 705 / 2},` +
        `toolbar=0,location=0,menubar=0,width=525,height=705`,
    });
  };

  const initInternetIdentity = async (identity: Identity) => {
    const backendActor = createBackendCanisterActor(backendCanisterId, {
      agentOptions: {
        identity,
        host: HOST,
      },
    });

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    await initUserSettings(backendActor);

    //let accounts = JSON.parse(await identity.accounts());

    update((state) => ({
      ...state,
      backendActor,
      principal: identity.getPrincipal(),
      //accountId: accounts[0].address, // we take the default account associated with the identity
      accountId: null,
      isAuthed: "internetidentity",
    }));
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
    const backendActor = createBackendCanisterActor(backendCanisterId, {
      agentOptions: {
        identity,
        host: HOST,
      },
    });

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    await initUserSettings(backendActor);

    // the stoic agent provides an `accounts()` method that returns
    // accounts associated with the principal
    let accounts = JSON.parse(await identity.accounts());

    update((state) => ({
      ...state,
      backendActor,
      principal: identity.getPrincipal(),
      accountId: accounts[0].address, // we take the default account associated with the identity
      isAuthed: "stoic",
    }));
  };

  const plugConnect = async () => {
    // check if plug is installed in the browser
    if (window.ic?.plug === undefined) {
      window.open("https://plugwallet.ooo/", "_blank");
      return;
    }

    // check if plug is connected
    const plugConnected = await window.ic?.plug?.isConnected();
    if (!plugConnected) {
      try {
        console.log({
          whitelist,
          host,
        });
        await window.ic?.plug.requestConnect({
          whitelist,
          host,
        });
        console.log("plug connected");
      } catch (e) {
        console.warn(e);
        return;
      }
    }

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
        ? console.log("agent created")
        : console.warn("agent creation failed");
    }
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
    }

    const backendActor = (await window.ic?.plug.createActor({
      canisterId: backendCanisterId,
      interfaceFactory: backendIdlFactory,
    })) as typeof DeVinci_backend;

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    await initUserSettings(backendActor);

    const principal = await window.ic.plug.agent.getPrincipal();

    update((state) => ({
      ...state,
      backendActor,
      principal,
      accountId: window.ic.plug.sessionManager.sessionData.accountId,
      isAuthed: "plug",
    }));

    console.log("plug is authed");
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
        console.log({
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
        ? console.log("agent created")
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

    const backendActor = (await window.ic?.infinityWallet.createActor({
      canisterId: backendCanisterId,
      interfaceFactory: backendIdlFactory,
      host,
    })) as typeof DeVinci_backend;

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    const principal = await window.ic.infinityWallet.getPrincipal();

    update((state) => ({
      ...state,
      backendActor,
      principal,
      //accountId: window.ic.infinityWallet.sessionManager.sessionData.accountId,
      isAuthed: "bitfinity",
    }));

    console.log("bitfinity is authed");
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
          console.log("plug disconnect failed, trying once more");
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
          console.log("Bitfinity disconnect failed, trying once more");
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

  return {
    subscribe,
    update,
    plugConnect,
    stoicConnect,
    nfidConnect,
    bitfinityConnect,
    internetIdentityConnect,
    disconnect,
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
