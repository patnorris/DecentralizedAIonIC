<script>
  import { userSettings } from "../store";
  import { updateUserSettingsProperty } from "../helpers/user_settings";

  let temperature = $userSettings.temperature || 0.6; // Use the existing temperature setting or default to 0.6
  let responseLength = $userSettings.responseLength || "Medium"; // Medium as default response length

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
</script>

<div class="settings-container">
  <div class="temperature-slider">
    <label for="temperature">Set LLM Temperature:</label>
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
  }
  input[type="range"] {
    flex-grow: 1;
  }
  .response-length div {
    margin-left: 20px;
  }
</style>