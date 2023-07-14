import { writable } from "svelte/store";
import type { Principal } from "@dfinity/principal";
import type { HttpAgent, Identity } from "@dfinity/agent";
import { StoicIdentity } from "ic-stoic-identity";
/* import {
  PersonalWebSpace_backend,
  createActor as createBackendCanisterActor,
  canisterId as backendCanisterId,
  idlFactory as backendIdlFactory,
} from "../declarations/PersonalWebSpace_backend";

import {
  newwave,
  createActor as createProtocolCanisterActor,
  canisterId as protocolCanisterId,
  idlFactory as protocolIdlFactory,
} from "../integrations/BebbProtocol"; */

//__________Local vs Mainnet Development____________
/* export const HOST =
  backendCanisterId === "vee64-zyaaa-aaaai-acpta-cai"
    ? "https://ic0.app" // Use in Production (on Mainnet)
    : "http://localhost:4943"; // to be used with http://localhost:4943/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai#/testroom */

export const HOST =
  process.env.NODE_ENV !== "development"
    ? "https://ic0.app"
    : "http://localhost:4943";

type State = {
  isAuthed: "plug" | "stoic" | null;
  //backendActor: typeof PersonalWebSpace_backend;
  //protocolActor: typeof newwave;
  principal: Principal;
  accountId: string;
  error: string;
  isLoading: boolean;
};

const defaultState: State = {
  isAuthed: null,
  /* backendActor: createBackendCanisterActor(backendCanisterId, {
    agentOptions: { host: HOST },
  }),
  protocolActor: createProtocolCanisterActor(protocolCanisterId, {
    agentOptions: { host: HOST },
  }), */
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
    /* const backendActor = createBackendCanisterActor(backendCanisterId, {
      agentOptions: {
        identity,
        host: HOST,
      },
    });

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    const protocolActor = createProtocolCanisterActor(protocolCanisterId, {
      agentOptions: {
        identity,
        host: HOST,
      },
    });
    if (!protocolActor) {
      console.warn("couldn't create protocol actor");
    }; */

    // the stoic agent provides an `accounts()` method that returns
    // accounts associated with the principal
    let accounts = JSON.parse(await identity.accounts());

    update((state) => ({
      ...state,
      /* backendActor,
      protocolActor, */
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

    /* const backendActor = (await window.ic?.plug.createActor({
      canisterId: backendCanisterId,
      interfaceFactory: backendIdlFactory,
    })) as typeof PersonalWebSpace_backend;

    if (!backendActor) {
      console.warn("couldn't create backend actor");
      return;
    };

    let protocolActor = defaultState.protocolActor;
    try {
      protocolActor = (await window.ic?.plug.createActor({
        canisterId: protocolCanisterId,
        interfaceFactory: protocolIdlFactory,
      })) as unknown as typeof newwave;
    } catch (err) {
      console.warn("couldn't create protocol actor");
      console.warn(err);
    }; */

    const principal = await window.ic.plug.agent.getPrincipal();

    update((state) => ({
      ...state,
      /* backendActor,
      protocolActor, */
      principal,
      accountId: window.ic.plug.sessionManager.sessionData.accountId,
      isAuthed: "plug",
    }));

    console.log("plug is authed");
  };

  const disconnect = async () => {
    console.log("disconnected");
    StoicIdentity.disconnect();
    window.ic?.plug?.disconnect();
    // wait for 500ms to ensure that the disconnection is complete
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("plug status: ", await window.ic?.plug?.isConnected());

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
    disconnect,
  };
};

export const store = createStore({
  //whitelist: [backendCanisterId, protocolCanisterId],
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
        //createActor: (options: {}) => Promise<typeof PersonalWebSpace_backend>;
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
    };
  }
}
