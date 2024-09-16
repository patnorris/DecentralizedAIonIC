<script lang="ts">
  export let disabled: boolean = undefined;
  export let style: string = "";
</script>

<button
  class="{style} flex items-center justify-center disabled:shadow-none hover:shadow shadow-black text-xl lg:text-base 2xl:text-xl bg-white border-2 border-black h-12 lg:h-10 w-full rounded-3xl font-mono -mb-0.5"
  on:click
  {disabled}
>
  <slot />
</button>
