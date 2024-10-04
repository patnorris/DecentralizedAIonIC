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

  // Function to handle changes in the system prompt
  async function handleSystemPromptChange(event) {
    systemPrompt = event.target.value;
    console.log("handleSystemPromptChange systemPrompt ", systemPrompt);
    $userSettings.systemPrompt = systemPrompt;
    await updateUserSettingsProperty("systemPrompt", systemPrompt);
  };

  // Function to reset system prompt to default
  async function resetSystemPrompt() {
    systemPrompt = systemPromptDefaultSetting;
    $userSettings.systemPrompt = systemPrompt;
    await updateUserSettingsProperty("systemPrompt", systemPrompt);
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
        on:input={handleTemperatureChange}
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
      <label for="systemPrompt">Set System Prompt:</label>
      <input
        type="text"
        id="systemPrompt"
        maxlength="50"
        value={systemPrompt}
        on:input={handleSystemPromptChange}
      />
      <button on:click={resetSystemPrompt}>Reset to Default</button>
      <p>This setting allows you to customize the AI's response style. The AI is instructed to reply accordingly, so please ensure that your system prompt is clear as otherwise the response quality will suffer. Note that you can also use a different language than English here (make sure though that the AI speaks it).</p>
    </div>
  </div>
</div>

<style>
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .temperature-slider, .response-length, .system-prompt {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }
  input[type="range"], input[type="text"] {
    flex-grow: 1;
  }
  .response-length div, .system-prompt {
    margin-left: 20px;
  }
</style>