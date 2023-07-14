<script lang="ts">
  export let style = "";
</script>

<div
  class="{style} overflow-clip bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl lg:rounded-3xl"
>
  <slot />
</div>
