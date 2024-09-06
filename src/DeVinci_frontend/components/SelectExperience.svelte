<script lang="ts">
  import { onMount } from "svelte";
  import {
    store,
    deviceType
  } from "../store";

  import SelectExperienceOption from './SelectExperienceOption.svelte';

  import { getAvailableAiModels } from "../helpers/ai_model_helpers";
  import { userHasDownloadedModel } from "../helpers/localStorage";

  export let onlyShowDownloadedModels = false;
  export let autoInitiateSelectedModel = false;

  // Reactive statement to check if the user has already downloaded at least one AI model
  $: userHasDownloadedAtLeastOneModel = userHasDownloadedModel();

  let availableAiModels = getAvailableAiModels(deviceType === 'Android');
  let chatModelDownloadInProgress = false;
  let selectedExperienceId;

  let availableExperiences = [
    // Oxford entry
    {
      id: "oxford", // Internal id assigned to experience
      title: "Oxford Hackathon Entry", // Title of experience to be shown on overview
      creator: "Arjaan & Patrick", // Name of the team who created this experience
      shortDescription: "This was the entry we put in at the Oxford hackathon", // max 2 sentences (200 characters)
      longDescription: "It was the first AI for education experience we created and it's the inspiration for more solutions to come (including this hackathon). It's based on the same approach DeVinci is taking: run the AI model on the user's device.", // max 100 words
      note: "Give it a try and think about how to improve it :)", // space for additional info team wants to provide to user on overview (max 50 words)
      isStandaloneApp: true, // Whether this experience loads in its own new tab (true) or can be loaded directly in this app (false)
      standaloneAppUrl: "https://6tht4-syaaa-aaaai-acriq-cai.icp0.io/#/learn", // Only for isStandaloneApp=true, URL to open in new tab
      experienceType: null, // For experiences loaded in this app, possible values: ondevice, onchain, offchain
      aiModelIdentifier: null, // Identifies and locates the AI model, value depends on experienceType (ondevice: WebLLM model id, onchain: IC canister id, offchain: URL where model is hosted and can be called)
      databaseToInclude: "none", // (Vector) database to include in model's responses, possible values: none, external, local
      databaseIdentifier: null, // Identifies and locates the (vector) database or its data to use, value depends on databaseToInclude (none: null, external: URL to call database, local: URL to data which will be loaded into a local vector database running in-browser)
    },
    // DeVinci
    {
      id: "devinci", // Internal id assigned to experience
      title: "DeVinci AI Chat App", // Title of experience to be shown on overview
      creator: "Nuno & Patrick", // Name of the team who created this experience
      shortDescription: "This is the first end-to-end-decentralized AI chat app and the codebase for this hackathon", // max 2 sentences (200 characters)
      longDescription: "DeVinci is the fully private, end-to-end-decentralized AI chat app served from the Internet Computer. AI models run directly on the user's device so no data needs to leave the device and you can even use it offline.", // max 100 words
      note: "Choose your favorite open-source Large Language Model and chat with it.", // space for additional info team wants to provide to user on overview (max 50 words)
      isStandaloneApp: true, // Whether this experience loads in its own new tab (true) or can be loaded directly in this app (false)
      standaloneAppUrl: "https://x6occ-biaaa-aaaai-acqzq-cai.icp0.io/", // Only for isStandaloneApp=true, URL to open in new tab
      experienceType: null, // For experiences loaded in this app, possible values: ondevice, onchain, offchain
      aiModelIdentifier: null, // Identifies and locates the AI model, value depends on experienceType (ondevice: WebLLM model id, onchain: IC canister id, offchain: URL where model is hosted and can be called)
      databaseToInclude: "none", // (Vector) database to include in model's responses, possible values: none, external, local
      databaseIdentifier: null, // Identifies and locates the (vector) database or its data to use, value depends on databaseToInclude (none: null, external: URL to call database, local: URL to data which will be loaded into a local vector database running in-browser)
    },
    // External
    {
      id: "randomid", // Internal id assigned to experience
      title: "Premier UN education", // Title of experience to be shown on overview
      creator: "Team AI Edu", // Name of the team who created this experience
      shortDescription: "This is your starting point for learning about UN's anti-corruption programs", // max 2 sentences (200 characters)
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec arcu a quam fringilla aliquet ut at erat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;", // max 100 words
      note: "Great for learners aged 8-12", // space for additional info team wants to provide to user on overview (max 50 words)
      isStandaloneApp: true, // Whether this experience loads in its own new tab (true) or can be loaded directly in this app (false)
      standaloneAppUrl: "https://x6occ-biaaa-aaaai-acqzq-cai.icp0.io/", // Only for isStandaloneApp=true, URL to open in new tab
      experienceType: null, // For experiences loaded in this app, possible values: ondevice, onchain, offchain
      aiModelIdentifier: null, // Identifies and locates the AI model, value depends on experienceType (ondevice: WebLLM model id, onchain: IC canister id, offchain: URL where model is hosted and can be called)
      databaseToInclude: "none", // (Vector) database to include in model's responses, possible values: none, external, local
      databaseIdentifier: null, // Identifies and locates the (vector) database or its data to use, value depends on databaseToInclude (none: null, external: URL to call database, local: URL to data which will be loaded into a local vector database running in-browser)
    },
    // on-device
    {
      id: "randomid2", // Internal id assigned to experience
      title: "The in-place on-device", // Title of experience to be shown on overview
      creator: "DeVinci", // Name of the team who created this experience
      shortDescription: "This is your starting point for learning about UN's anti-corruption programs", // max 2 sentences (200 characters)
      longDescription: "Sed scelerisque, nisl at fermentum eleifend, nisl ipsum congue erat, nec dignissim elit libero sed est. Morbi non libero malesuada, interdum metus id, dapibus nisi. Ut sit amet velit nec purus fermentum placerat vel a lacus. Vivamus faucibus felis ac risus elementum, nec elementum erat tempus.", // max 100 words
      note: "Great for learners aged 8-12", // space for additional info team wants to provide to user on overview (max 50 words)
      isStandaloneApp: false, // Whether this experience loads in its own new tab (true) or can be loaded directly in this app (false)
      standaloneAppUrl: null, // Only for isStandaloneApp=true, URL to open in new tab
      experienceType: "ondevice", // For experiences loaded in this app, possible values: ondevice, onchain, offchain
      aiModelIdentifier: "SmolLM-135M-Instruct-q0f16-MLC", // Identifies and locates the AI model, value depends on experienceType (ondevice: WebLLM model id, onchain: IC canister id, offchain: URL where model is hosted and can be called)
      databaseToInclude: "none", // (Vector) database to include in model's responses, possible values: none, external, local
      databaseIdentifier: null, // Identifies and locates the (vector) database or its data to use, value depends on databaseToInclude (none: null, external: URL to call database, local: URL to data which will be loaded into a local vector database running in-browser)
    },
    {
      id: "1", // Internal id assigned to experience
      title: "No-corruption", // Title of experience to be shown on overview
      creator: "Team Kong", // Name of the team who created this experience
      shortDescription: "This is your starting point for learning about UN's anti-corruption programs", // max 2 sentences (200 characters)
      longDescription: "This experience includes a lot of fun interactive info. It's AI-powered.", // max 100 words
      note: "Great for learners aged 8-12", // space for additional info team wants to provide to user on overview (max 50 words)
      isStandaloneApp: true, // Whether this experience loads in its own new tab (true) or can be loaded directly in this app (false)
      standaloneAppUrl: "https://x6occ-biaaa-aaaai-acqzq-cai.icp0.io/", // Only for isStandaloneApp=true, URL to open in new tab
      experienceType: "ondevice", // For experiences loaded in this app, possible values: ondevice, onchain, offchain
      aiModelIdentifier: "SmolLM-135M-Instruct-q0f16-MLC", // Identifies and locates the AI model, value depends on experienceType (ondevice: WebLLM model id, onchain: IC canister id, offchain: URL where model is hosted and can be called)
      databaseToInclude: "none", // (Vector) database to include in model's responses, possible values: none, external, local
      databaseIdentifier: null, // Identifies and locates the (vector) database or its data to use, value depends on databaseToInclude (none: null, external: URL to call database, local: URL to data which will be loaded into a local vector database running in-browser)
    },
  ];

  onMount(async () => {
    console.log("in onMount");
    availableExperiences = await $store.backendActor.get_education_experiences(); //TODO: transform retrieved experiences to UI format  
    console.log("availableExperiences"); 
    console.log(availableExperiences);
  });

</script>

  <ul class="grid w-full gap-2 md:grid-cols-1 px-4 mt-0">
    <div class="w-full mb-4 px-4 py-3 text-gray-500 inline-block border border-[#b0c4de] rounded-lg sm:px-5 bg-gray-50">
      <b>Please select an experience</b>. More information on the experience will show up when you select it.
    </div>

    {#each availableExperiences as option}
      <SelectExperienceOption
        id={option.id}
        title={option.title}
        creator={option.creator}
        shortDescription={option.shortDescription}
        longDescription={option.longDescription}
        note={option.note}
        isStandaloneApp={option.isStandaloneApp}
        standaloneAppUrl={option.standaloneAppUrl}
        experienceType={option.experienceType}
        aiModelIdentifier={option.aiModelIdentifier}
        databaseToInclude={option.databaseToInclude}
        databaseIdentifier={option.databaseIdentifier}
        bind:selectedExperienceId
      />
    {/each}
  </ul>
