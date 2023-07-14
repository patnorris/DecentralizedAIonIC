<script lang="ts">
  export let message;
</script>

<div class="message">
  <p><strong>{message.user}</strong></p>
  <p>{message.text}</p>
</div>

<style>
  .message {
    margin-bottom: 10px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 4px;
  }
</style>
