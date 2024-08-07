<script lang="ts">
  import ChatBubbleUser from './ChatBubbleUser.svelte';
  import ChatBubbleDeVinci from './ChatBubbleDeVinci.svelte';

  export let message;
</script>

<div class="message">
  {#if message.name === 'You'}
    <ChatBubbleUser messageContent={message.content} />
  {:else if message.name === 'DeVinci'}
    <ChatBubbleDeVinci messageContent={message.content} />
  {/if}
</div>

<style>
  .message {
    margin-bottom: 10px;
  }
</style>
