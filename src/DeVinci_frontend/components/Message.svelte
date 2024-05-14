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
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 4px;
  }
</style>
