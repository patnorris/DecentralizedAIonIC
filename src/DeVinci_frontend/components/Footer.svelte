<script lang="ts">
  import { location } from 'svelte-spa-router';
  import { submitEmailSignUpForm } from "../helpers/utils.js";

  let message = "";
  const submitForm = async (event) => {
    event.preventDefault();
    // @ts-ignore
    const email = document.getElementById('hero-email').value;
    message = await submitEmailSignUpForm(email, $location);
  };
</script>

<footer class='py-7 space-y-6 items-center text-center' id='about'>
  <div>
    <img src="./FutureWebInitiative_img.png" alt="Future Web Initiative logo">
    <span>DeVinci</span>
  </div>
  <div>
    <p>Want to be the first to hear about updates from us?</p>
    <form on:submit={submitForm} class="email-signup-form">
      <input type="email" id="hero-email" class="email-signup-form-input" placeholder="Enter your email...">
      <button type="submit" class="email-signup-form-button">Submit</button>
    </form>
    {#if message}
      <h2>{message}</h2>
    {/if}
  </div>
  <p>Powered by <a href='https://www.onicai.com/' target='_blank' rel="noreferrer" class='underline'>onicai</a> and hosted on <a href='https://internetcomputer.org/' target='_blank' rel="noreferrer" class='underline'>Internet Computer</a></p>
</footer>

<style>  
  .email-signup-form {
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .email-signup-form-input[type="email"] {
      padding: 10px;
      font-size: 1em;
      margin-right: 10px;
      color: #000000;
  }

  .email-signup-form-button {
      padding: 10px 20px;
      font-size: 1em;
      background-color: #4ebaa5;
      color: #ffffff;
      border: none;
      cursor: pointer;
  }
  </style>