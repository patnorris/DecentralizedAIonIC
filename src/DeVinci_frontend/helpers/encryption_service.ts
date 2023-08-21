// Copied from https://github.com/dfinity/examples/blob/master/motoko/encrypted-notes-dapp-vetkd/src/frontend/src/lib/crypto.ts

import type {
  DeVinci_backend,
} from "../../declarations/DeVinci_backend";

import * as agent from "@dfinity/agent";

// Usage of the imported bindings only works if the respective .wasm was loaded, which is done in main.ts.
// See also https://github.com/rollup/plugins/tree/master/packages/wasm#using-with-wasm-bindgen-and-wasm-pack
import * as vetkd from 'ic-vetkd-utils'; //"./vetkd_user_lib/ic_vetkd_utils.js";

export class CryptoService {
  constructor(private actor: typeof DeVinci_backend) {
  }

  // Symmetric AES key, used to encrypt and decrypt the notes stored in the dapp
  private vetAesGcmKey: CryptoKey | null = null;

  /**
   * Fetch the authenticated user's vetKD key and derive an AES-GCM key from it
   */
  public async init() {
    // Showcase that the integration of the vetkd user library works
    const seed = window.crypto.getRandomValues(new Uint8Array(32));
    const tsk = new vetkd.TransportSecretKey(seed);
    console.time('Execution Time encrypted_symmetric_key_for_caller');
    //const ek_bytes_hex = await this.actor.encrypted_symmetric_key_for_caller(tsk.public_key());  
    const ek_bytes_hex_promise = this.actor.encrypted_symmetric_key_for_caller(tsk.public_key());    
    console.timeEnd('Execution Time encrypted_symmetric_key_for_caller');

    console.time('Execution Time symmetric_key_verification_key'); 
    //const pk_bytes_hex = await this.actor.symmetric_key_verification_key(); 
    const pk_bytes_hex_promise = this.actor.symmetric_key_verification_key();    
    console.timeEnd('Execution Time symmetric_key_verification_key');

    console.time('Execution Time getPrincipal');  
    //const principal = await agent.Actor.agentOf(this.actor).getPrincipal(); 
    const principal_promise = agent.Actor.agentOf(this.actor).getPrincipal();  
    console.timeEnd('Execution Time getPrincipal');

    console.time('Execution Time Promise');
    const promiseResponses = await Promise.all([ek_bytes_hex_promise, pk_bytes_hex_promise, principal_promise]); 
    console.timeEnd('Execution Time Promise');

    const ek_bytes_hex = promiseResponses[0];
    const pk_bytes_hex = promiseResponses[1];
    const principal = promiseResponses[2];

    console.log('Debug ek_bytes_hex', ek_bytes_hex);
    console.log('Debug pk_bytes_hex', pk_bytes_hex);
    console.log('Debug principal', principal);

    console.time('Execution Time decrypt_and_hash');
    const aes_256_gcm_key_raw = tsk.decrypt_and_hash(
      hex_decode(ek_bytes_hex),
      hex_decode(pk_bytes_hex),
      principal.toUint8Array(),
      32,
      new TextEncoder().encode("aes-256-gcm")
    );
    console.timeEnd('Execution Time decrypt_and_hash');

    console.time('Execution Time importKey'); 
    this.vetAesGcmKey = await window.crypto.subtle.importKey("raw", aes_256_gcm_key_raw, "AES-GCM", false, ["encrypt", "decrypt"]);   
    console.timeEnd('Execution Time importKey');
  }

  public logout() {
    this.vetAesGcmKey = null;
  }

  public isInitialized() {
    return this.vetAesGcmKey !== null;
  }

  // The function encrypts data with the shared secretKey.
  public async encrypt(data: string) {
    if (this.vetAesGcmKey === null) {
      throw new Error('null shared secret!');
    };
    const data_encoded = Uint8Array.from([...data].map(ch => ch.charCodeAt(0))).buffer;
    // The iv must never be reused with a given key.
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      this.vetAesGcmKey,
      data_encoded
    );

    const iv_decoded = String.fromCharCode(...new Uint8Array(iv));
    const cipher_decoded = String.fromCharCode(...new Uint8Array(ciphertext));
    return iv_decoded + cipher_decoded;
  };

  // The function decrypts the given input data.
  public async decrypt(data: string) {
    if (this.vetAesGcmKey === null) {
        throw new Error('null shared secret!');
    };
    if (data.length < 13) {
        throw new Error('wrong encoding, too short to contain iv');
    }
    const iv_decoded = data.slice(0,12);
    const cipher_decoded = data.slice(12);
    const iv_encoded = Uint8Array.from([...iv_decoded].map(ch => ch.charCodeAt(0))).buffer;
    const ciphertext_encoded = Uint8Array.from([...cipher_decoded].map(ch => ch.charCodeAt(0))).buffer;

    let decrypted_data_encoded = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv_encoded
      },
      this.vetAesGcmKey,
      ciphertext_encoded
    );
    const decrypted_data_decoded = String.fromCharCode(...new Uint8Array(decrypted_data_encoded));
    return decrypted_data_decoded;
  }
}

const hex_decode = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
const hex_encode = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');