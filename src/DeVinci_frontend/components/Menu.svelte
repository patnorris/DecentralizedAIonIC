<script>
  import { fly, scale } from 'svelte/transition';
  import { quadOut } from 'svelte/easing';

  export let open;
</script>

{#if open}
  <div>
      {#each ['Home', 'Example', 'About', 'Contact'] as link, i}
          <p transition:fly={{ y: -15, delay: 50 * i }}>
              {link}
          </p>
      {/each}
  </div>

  <hr transition:scale={{ duration: 650, easing: quadOut, opacity: 1 }} />
{/if}

<style>
  /* :global(html) {
      background: #1d1d2f;
  } */
  div {
    z-index: 10;
    position: relative;
    height: 60%; 
    width: 50%;
    margin: auto;
    text-align: center;
    font-size: 1.5em;
    letter-spacing: 0.15em;
    padding: 1em;
    padding-top: 0;
    background: #1d1d2f;
    opacity: 80%;
    color: #eef;
  }
  p {
    cursor: pointer;
    width: max-content;
    margin: 1rem auto;
  }
  p:hover {
    text-decoration: underline;
  }
</style>
