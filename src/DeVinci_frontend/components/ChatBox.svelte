<script lang="ts">
  import Message from './Message.svelte';

  export let modelCallbackFunction;

  let newMessageText = '';
  let messages = [];

  let replyText = 'Thinking...';

  let messageGenerationInProgress = false;

  const generateProgressCallback = (_step: number, message: string) => {
    replyText = message;
    messages = [...messages.slice(0, -1), { user: 'DeVinci', text: replyText }];
  };

  async function sendMessage() {
    messageGenerationInProgress = true;
    if(newMessageText.trim() !== '') {
      console.log("Sending message: ", newMessageText.trim());
      messages = [...messages, { user: 'You', text: newMessageText.trim() }];
      const newPrompt = newMessageText.trim();
      newMessageText = '';
      try {
        messages = [...messages, { user: 'DeVinci', text: replyText }];
        console.log("Sending prompt to model: ", newPrompt);
        const reply = await modelCallbackFunction(newPrompt, generateProgressCallback);
        messages = [...messages.slice(0, -1), { user: 'DeVinci', text: reply }];
        console.log("Got response from model: ", reply);   
      } catch (error) {
        console.error("Error getting response from model: ", error);
        messages = [...messages, { user: 'DeVinci', text: "There was an error unfortunately. Please try again." }];
      }
      replyText = 'Thinking...';
    }
    messageGenerationInProgress = false;
  };
</script>

<div class="chatbox">
  <div class="messages">
    {#each messages as message (message.text)}
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
