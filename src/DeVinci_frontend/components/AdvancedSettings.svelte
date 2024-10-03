<script>
  import { userSettings } from "../store";
  import { updateUserSettingsProperty, temperatureDefaultSetting, responseLengthDefaultSetting } from "../helpers/user_settings";

  $: temperature = $userSettings.temperature || temperatureDefaultSetting; // Use the existing temperature setting or default
  $: responseLength = $userSettings.responseLength || responseLengthDefaultSetting; // Medium as default response length

  // Function to handle changes in the temperature slider
  async function handleTemperatureChange(event) {
    temperature = parseFloat(event.target.value);
    $userSettings.temperature = temperature;
    userSettings.set($userSettings);
    await updateUserSettingsProperty("temperature", temperature);
  };

  // Function to handle changes in response length
  async function handleResponseLengthChange(event) {
    responseLength = event.target.value;
    $userSettings.responseLength = responseLength;
    userSettings.set($userSettings);
    await updateUserSettingsProperty("responseLength", responseLength);
  };
</script>

<div id="alert-additional-content-4" class="p-4 m-4 text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#151b1e] rounded-lg" role="alert">
  <div class="flex items-center">
    <span class="sr-only">Info</span>
    <h3 class="text-lg font-medium"> Advanced Settings</h3>
  </div>
  <div class="mt-2 mb-4 text-sm">
    These settings determine how the AI model responds to your messages.
  </div>
  <div>
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
  input[type="range"] {
    flex-grow: 1;
  }
  .response-length div {
    margin-left: 20px;
  }
</style>