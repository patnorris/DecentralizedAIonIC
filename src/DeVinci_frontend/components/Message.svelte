<script lang="ts">
  import { marked } from 'marked';

  export let message;
</script>

<div class="message">
  <p><strong>{message.name}</strong></p>
  <p>{@html marked(message.content)}</p>
</div>

<style>
  .message {
    margin-bottom: 10px;
    padding: 10px;
  }
</style>
