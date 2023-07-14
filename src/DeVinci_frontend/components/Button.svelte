<script lang="ts">
  export let disabled: boolean = undefined;
  export let style: string = "";
</script>

<button
  class="{style} flex items-center justify-center disabled:shadow-none hover:shadow shadow-black dark:shadow-white text-xl lg:text-base 2xl:text-xl bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 lg:h-10 w-full rounded-3xl font-mono -mb-0.5"
  on:click
  {disabled}
>
  <slot />
</button>
