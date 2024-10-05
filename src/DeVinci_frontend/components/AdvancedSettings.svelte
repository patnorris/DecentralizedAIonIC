<script>
  import {
    userSettings,
    temperatureDefaultSetting,
    responseLengthDefaultSetting,
    systemPromptDefaultSetting
  } from "../store";
  import { updateUserSettingsProperty } from "../helpers/user_settings";

  $: temperature = $userSettings.temperature || temperatureDefaultSetting;
  $: responseLength = $userSettings.responseLength || responseLengthDefaultSetting;
  $: systemPrompt = $userSettings.systemPrompt || systemPromptDefaultSetting;

  // Function to handle changes in the temperature slider
  async function handleTemperatureChange(event) {
    temperature = parseFloat(event.target.value);
    $userSettings.temperature = temperature;
    await updateUserSettingsProperty("temperature", temperature);
  };

  // Function to handle changes in response length
  async function handleResponseLengthChange(event) {
    responseLength = event.target.value;
    $userSettings.responseLength = responseLength;
    await updateUserSettingsProperty("responseLength", responseLength);
  };

  // Function to update the system prompt
  async function updateSystemPrompt() {
    const inputElement = document.getElementById('systemPromptInput');
    if (inputElement) {
      console.log('Input value:', inputElement.value);
      systemPrompt = inputElement.value;
      console.log("updateSystemPrompt systemPrompt ", systemPrompt);
      $userSettings.systemPrompt = systemPrompt;
      await updateUserSettingsProperty("systemPrompt", systemPrompt);
    };
  };

  // Function to reset system prompt to default
  async function resetSystemPrompt() {
    systemPrompt = systemPromptDefaultSetting;
    await updateSystemPrompt();
  };
</script>

<div id="alert-additional-content-4" class="p-4 m-4 text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#151b1e] rounded-lg" role="alert">
  <div class="flex items-center">
    <span class="sr-only">Info</span>
    <h3 class="text-lg font-medium">Advanced Settings</h3>
  </div>
  <div class="mt-2 mb-4 text-sm">
    These settings determine how the AI model responds to your messages.
  </div>
  <div>
    <!-- Temperature Slider -->
    <div class="temperature-slider">
      <label for="temperature">Set AI's Allowed Creativity:</label>
      <input
        type="range"
        id="temperature"
        min="0"
        max="1"
        step="0.01"
        value={temperature}
        on:change={handleTemperatureChange}
      />
      <span>{temperature.toFixed(2)}</span>
    </div>
  
    <!-- Response Length Radio Buttons -->
    <div class="response-length">
      <label>Choose Response Length:</label>
      <div>
        <input type="radio" id="short" value="Short" checked={responseLength === 'Short'} on:change={handleResponseLengthChange} />
        <label for="short">Short</label>
      </div>
      <div>
        <input type="radio" id="medium" value="Medium" checked={responseLength === 'Medium'} on:change={handleResponseLengthChange} />
        <label for="medium">Medium</label>
      </div>
      <div>
        <input type="radio" id="long" value="Long" checked={responseLength === 'Long'} on:change={handleResponseLengthChange} />
        <label for="long">Long</label>
      </div>
    </div>

    <!-- System Prompt Text Input -->
    <div class="system-prompt">
      <div class="prompt-control">
        <label for="systemPromptInput">Set System Prompt:</label>
        <input
          type="text"
          id="systemPromptInput"
          maxlength="50"
          value={systemPrompt}
        />
      </div>
      <div class="prompt-buttons">
        <button on:click={updateSystemPrompt}>Update Prompt</button>
        <button on:click={resetSystemPrompt}>Reset to Default</button>
      </div>
      <div class="prompt-info">
        <p>This setting allows you to customize the AI's response style. The AI is instructed to reply accordingly, so please ensure that your system prompt is clear as otherwise the response quality will suffer. Note that you can also use a different language than English here (make sure though that the AI speaks it).</p>
      </div>
    </div>
  </div>
</div>

<style>
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .temperature-slider, .response-length {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }
  input[type="range"], input[type="text"] {
    flex-grow: 1;
  }
  .response-length div {
    margin-left: 20px;
  }
  .system-prompt {
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
  }
  .prompt-control, .prompt-buttons, .prompt-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 3px;
  }
  .prompt-control {
    justify-content: start;
  }
  .prompt-info {
    flex-direction: column;
  }
</style>