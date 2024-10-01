<script>
  import {
    userSettings
  } from "../store";

  import { updateUserSettingsProperty } from "../helpers/user_settings";

  let temperature = $userSettings.temperature | 0.6;

  // Function to handle changes in the slider
  async function handleTemperatureChange(event) {
    temperature = parseFloat(event.target.value);
    $userSettings.temperature = temperature;
    await updateUserSettingsProperty("temperature", temperature);
  }
</script>

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

<style>
  .temperature-slider {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input[type="range"] {
    flex-grow: 1;
  }
</style>
