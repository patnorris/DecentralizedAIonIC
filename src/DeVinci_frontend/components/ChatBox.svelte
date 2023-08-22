<script lang="ts">
  import { onMount } from "svelte";
  import { store, encryptionEnabledByUserGlobal, encryptionEnabledGlobal, encryptionServiceGlobal } from "../store";
  import { now } from "svelte/internal";

  import Message from './Message.svelte';

  import type { Chat } from "../../declarations/DeVinci_backend/DeVinci_backend.did";
  import type { CryptoService } from '../helpers/encryption_service';

  import { isEncryptionServiceInit } from "../helpers/utils";

  export let modelCallbackFunction;
  export let chatDisplayed;

  let newMessageText = '';
  let messages = [];

  let replyText = 'Thinking...';

  let messageGenerationInProgress = false;

  let cryptoService: CryptoService;
  encryptionServiceGlobal.subscribe((value) => cryptoService = value);

// Toggle whether user wants their messages to be stored
  let storeChatToggle = true;

  function handleStoreChatToggle() {
    storeChatToggle = !storeChatToggle;
  };

// Toggle whether user wants their chats to be encrypted
  let encryptChatsToggle = true;
  encryptionEnabledByUserGlobal.subscribe((value) => encryptChatsToggle = value);

  function handleEncryptChatsToggle() {
    encryptionEnabledByUserGlobal.update((value) => !value);
  };

  const generateProgressCallback = (_step: number, message: string) => {
    replyText = message;
    messages = [...messages.slice(0, -1), { sender: 'DeVinci', content: replyText }];
  };

  async function sendMessage() {
    messageGenerationInProgress = true;
    if(newMessageText.trim() !== '') {
      messages = [...messages, { sender: 'You', content: newMessageText.trim() }];
      const newPrompt = newMessageText.trim();
      newMessageText = '';
      try {
        messages = [...messages, { sender: 'DeVinci', content: replyText }];
        const reply = await modelCallbackFunction(newPrompt, generateProgressCallback);
        messages = [...messages.slice(0, -1), { sender: 'DeVinci', content: reply }]; 
      } catch (error) {
        console.error("Error getting response from model: ", error);
        messages = [...messages, { sender: 'DeVinci', content: "There was an error unfortunately. Please try again." }];
      }
      replyText = 'Thinking...';
    }
    messageGenerationInProgress = false;
    // Store chat
    if (storeChatToggle && $store.isAuthed) {
      // Prepare messages object and potentially encrypt
      const messagesObject = {
        messages: JSON.stringify(messages),
        encrypted: false,
      };
      if (encryptChatsToggle && $encryptionEnabledGlobal) {
        // Encrypt
        messagesObject.encrypted = true;
        // Ensure encryption service is initialized before usage
        const encryptionServiceIsInit = await isEncryptionServiceInit();
        if (!encryptionServiceIsInit) {
          console.error("Error: Encryption service not initialized.");
          return;
        };
        const encryptedMessages = await cryptoService.encrypt(
          messagesObject.messages
        );
        messagesObject.messages = encryptedMessages;
      };
      if(chatDisplayed) {
        // Update chat
        try {
          const chatUpdatedResponse = await $store.backendActor.update_chat_messages(chatDisplayed.id, messagesObject);
        } catch (error) {
          console.error("Error storing chat: ", error);        
        };
      } else {
        // New chat
        try {
          // Prepare first message object and potentially encrypt
          const firstMessagePreviewObject = {
            firstMessagePreview: messages[0].content,
            encrypted: false,
          };
          if (encryptChatsToggle && $encryptionEnabledGlobal) {
            // Encrypt
            firstMessagePreviewObject.encrypted = true;
            // Ensure encryption service is initialized before usage
            const encryptionServiceIsInit = await isEncryptionServiceInit();
            if (!encryptionServiceIsInit) {
              console.error("Error: Encryption service not initialized.");
              return;
            };
            const encryptedFirstMessagePreview = await cryptoService.encrypt(
              firstMessagePreviewObject.firstMessagePreview
            );
            firstMessagePreviewObject.firstMessagePreview = encryptedFirstMessagePreview;
          };
          const chatCreatedResponse = await $store.backendActor.create_chat(messagesObject, firstMessagePreviewObject);
          // @ts-ignore
          if (chatCreatedResponse.Err) {
            // @ts-ignore
            console.error("Error message creating new chat: ", chatCreatedResponse.Err);
          } else {
            // @ts-ignore
            let newChatId = chatCreatedResponse.Ok;
            let newChatPreview = {
              id: newChatId,
              creationTime: now(),
              firstMessagePreview: messages[0].content,
              chatTitle: "",
            };
            chatDisplayed = newChatPreview;
          };
        } catch (error) {
          console.error("Error creating new chat: ", error);       
        };
      };
    };
  };

// Retrieve the chat's history if an existing chat is to be displayed
  let chatRetrievalInProgress = false;

  const loadChat = async () => {
    if(chatDisplayed) {
      chatRetrievalInProgress = true;
      const chatHistoryResponse = await $store.backendActor.get_chat(chatDisplayed.id);
      // @ts-ignore
      const chatHistory : Chat = chatHistoryResponse.Ok;
      if (chatHistory.messages.encrypted) {
        // Decrypt
        // Ensure encryption service is initialized before usage
        const encryptionServiceIsInit = await isEncryptionServiceInit();
        if (!encryptionServiceIsInit) {
          console.error("Error: Encryption service not initialized.");
          return;
        };
        const decryptedMessages = await cryptoService.decrypt(chatHistory.messages.messages);
        messages = JSON.parse(decryptedMessages);
      } else {
        messages = JSON.parse(chatHistory.messages.messages);
      };
      chatRetrievalInProgress = false;
    };
    // Fresh chat
  };

  onMount(loadChat);
</script>

{#if !$store.isAuthed}
  <div>
    <p>Please note that you may only store chats (and access additional features) if you log in.</p>
  </div>
{:else}
  <div>
    <p>Should your chat messages be stored?</p>
    <input type="checkbox" bind:checked={storeChatToggle} on:click={handleStoreChatToggle} />
    <span>{storeChatToggle ? 'YES' : 'NO'}</span>
  </div>
  <div>
    <p>Do you want your chats to be encrypted for maximal privacy?</p>
    <input type="checkbox" bind:checked={encryptChatsToggle} on:click={handleEncryptChatsToggle} />
    <span>{encryptChatsToggle ? 'YES' : 'NO'}</span>
  </div>
{/if}

<div class="chatbox">
  <div class="messages">
    {#each messages as message (message.content)}
      <Message {message} />
    {/each}
  </div>

  <div class="message-input">
    <input bind:value={newMessageText} placeholder="Type your message here..." />
    {#if messageGenerationInProgress}
      <button disabled on:click={sendMessage}>Send</button>
    {:else}
      <button on:click={sendMessage}>Send</button>
    {/if}
  </div>
</div>

<style>
  .chatbox {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
  }

  .messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .message-input {
    height: 60px;
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
  }

  .message-input input {
    height: 40px;
    flex-grow: 1;
    margin-right: 10px;
  }
</style>
