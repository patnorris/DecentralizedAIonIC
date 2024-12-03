const availableAiModels = [
  { //requires shader-f16
    id: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    name: 'Llama3.1 8B',
    size: 'Large',
    parameters: '8 billion',
    performance: 'Super Good',
    goodFor: 'English, German, French, Italian, Portuguese, Hindi, Spanish, Thai',
    default: false,
    vramRequired: 4598.34
  },
  { //requires shader-f16
    id: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
    name: 'Phi3.5',
    size: 'Medium',
    parameters: '3.8 billion',
    performance: 'Very Good',
    goodFor: 'German, English, Spanish, French, Japanese, Russian, Thai, Chinese, Dutch, Ukrainian',
    default: false,
    vramRequired: 2740.48
  },
  { //requires shader-f16
    id: 'SmolLM-1.7B-Instruct-q0f16-MLC',
    name: 'SmolLM 1.7B',
    size: 'Small',
    parameters: '1.7 billion',
    performance: 'Good',
    goodFor: 'English',
    default: false,
    vramRequired: 1843.20
  },
  { //requires shader-f16
    id: 'SmolLM-360M-Instruct-q0f16-MLC',
    name: 'SmolLM 360M',
    size: 'Very Small',
    parameters: '360 million',
    performance: 'Quite Good',
    goodFor: 'English',
    default: false,
    vramRequired: 512.45
  },
  { //requires shader-f16
    id: 'SmolLM-135M-Instruct-q0f16-MLC',
    name: 'SmolLM 135M',
    size: 'Super Small',
    parameters: '135 million',
    performance: 'Alright',
    goodFor: 'English',
    default: false,
    vramRequired: 256.32
  },
  { //requires shader-f16
    id: 'gemma-2-2b-it-q4f16_1-MLC',
    name: 'Gemma 2 2B',
    size: 'Small',
    parameters: '2 billion',
    performance: 'Good',
    goodFor: 'English',
    default: true,
    vramRequired: 2131.97
  },
  { //requires shader-f16
    id: 'gemma-2-9b-it-q4f16_1-MLC',
    name: 'Gemma 2 9B',
    size: 'Large',
    parameters: '9 billion',
    performance: 'Super Good',
    goodFor: 'English',
    default: false,
    vramRequired: 5120.64
  },
  { //requires shader-f16
    id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 0.5B',
    size: 'Very Small',
    parameters: '0.5 billion',
    performance: 'Quite Good',
    goodFor: 'Chinese, English, Japanese, Korean, Vietnamese, Thai, Arabic, French, Spanish, Portuguese, German, Italian, Russian',
    default: false,
    vramRequired: 768.45
  },
  { //requires shader-f16
    id: "Qwen2.5-1.5B-Instruct-q4f32_1-MLC",
    name: 'Qwen2.5 1.5B',
    size: 'Small',
    parameters: '1.5 billion',
    performance: 'Good',
    goodFor: 'Chinese, English, Japanese, Korean, Vietnamese, Thai, Arabic, French, Spanish, Portuguese, German, Italian, Russian',
    default: false,
    vramRequired: 1843.20
  },
  { //requires shader-f16
    id: "Qwen2.5-7B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 7B',
    size: 'Large',
    parameters: '7 billion',
    performance: 'Very Good',
    goodFor: 'Chinese, English, Japanese, Korean, Vietnamese, Thai, Arabic, French, Spanish, Portuguese, German, Italian, Russian',
    default: false,
    vramRequired: 4032.48
  },
  { //requires shader-f16
    id: "Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 Coder 1.5B',
    size: 'Small',
    parameters: '1.5 billion',
    performance: 'Good',
    goodFor: 'Coding',
    default: false,
    vramRequired: 1843.20
  },
  { //requires shader-f16
    id: "Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 Coder 7B',
    size: 'Large',
    parameters: '7 billion',
    performance: 'Very Good',
    goodFor: 'Coding',
    default: false,
    vramRequired: 4032.48
  },
  { //requires shader-f16
    id: "Qwen2.5-Math-1.5B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 Math',
    size: 'Small',
    parameters: '1.5 billion',
    performance: 'Good',
    goodFor: 'Math',
    default: false,
    vramRequired: 1843.20
  },
  { //requires shader-f16
    id: 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC',
    name: 'TinyLlama',
    size: 'Very Small',
    parameters: '1.1 billion',
    performance: 'Alright',
    goodFor: 'English',
    default: false,
    vramRequired: 1024.56
  },
  { //requires shader-f16
    id: 'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
    name: 'Mistral',
    size: 'Large',
    parameters: '7 billion',
    performance: 'Very Good',
    goodFor: 'English',
    default: false,
    vramRequired: 4032.48
  },
  { //requires shader-f16
    id: 'WizardMath-7B-V1.1-q4f16_1-MLC',
    name: 'WizardMath',
    size: 'Large',
    parameters: '7 billion',
    performance: 'Very Good',
    goodFor: 'Math',
    default: false,
    vramRequired: 4032.48
  },
  { //requires shader-f16
    id: 'Llama-3.1-70B-Instruct-q3f16_1-MLC',
    name: 'Llama3.1 70B',
    size: 'Gigantic',
    parameters: '70 billion',
    performance: 'Insane',
    goodFor: 'English, German, French, Italian, Portuguese, Hindi, Spanish, Thai',
    default: false,
    vramRequired: 35840.72
  },
  // Android WebGPU models (q4f32 models typically require more VRAM)
  {
    model: "https://huggingface.co/mlc-ai/Qwen2-1.5B-Instruct-q4f32_1-MLC",
    id: "Qwen2-1.5B-Instruct-q4f32_1-MLC",
    name: 'Qwen2 1.5B',
    size: 'Tiny',
    parameters: '1.5 billion',
    performance: 'Good',
    goodFor: 'Chinese, English',
    default: true,
    android: true,
    vramRequired: 2048.64
  },
  {
    id: 'Llama-3.1-8B-Instruct-q4f32_1-MLC-1k',
    name: 'Llama3.1 8B',
    size: 'Large',
    parameters: '8 billion',
    performance: 'Super Good',
    goodFor: 'English, German, French, Italian, Portuguese, Hindi, Spanish, Thai',
    default: false,
    android: true,
    vramRequired: 5120.64
  },
  {
    id: 'Phi-3.5-mini-instruct-q4f32_1-MLC-1k',
    name: 'Phi3.5',
    size: 'Medium',
    parameters: '3.8 billion',
    performance: 'Very Good',
    goodFor: 'German, English, Spanish, French, Japanese, Russian, Thai, Chinese, Dutch, Ukrainian',
    default: false,
    android: true,
    vramRequired: 3072.56
  },
  {
    id: 'SmolLM-1.7B-Instruct-q4f32_1-MLC',
    name: 'SmolLM 1.7B',
    size: 'Small',
    parameters: '1.7 billion',
    performance: 'Good',
    goodFor: 'English',
    default: false,
    android: true,
    vramRequired: 2048.64
  },
  {
    id: 'gemma-2-2b-it-q4f32_1-MLC-1k',
    name: 'Gemma 2',
    size: 'Small',
    parameters: '2 billion',
    performance: 'Good',
    goodFor: 'English',
    default: false,
    android: true,
    vramRequired: 2740.48
  },
  {
    id: 'TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC-1k',
    name: 'TinyLlama',
    size: 'Small',
    parameters: '1.1 billion',
    performance: 'Alright',
    goodFor: 'English',
    default: false,
    android: true,
    vramRequired: 1536.45
  },
  {
    id: 'RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC-1k',
    name: 'Red Pajama',
    size: 'Medium',
    parameters: '3 billion',
    performance: 'Alright',
    goodFor: 'English',
    default: false,
    android: true,
    vramRequired: 3072.56
  }
];

export const getAvailableAiModels = (isAndroid = false) => {
  return availableAiModels.filter((model) => isAndroid ? model.android === isAndroid : !model.android);
};

export const getDefaultAiModelId = (isAndroid = false) => {
  if (isAndroid) {
    return availableAiModels.find(model => model.android && model.default).id;
  };
  return availableAiModels.find(model => model.default && !model.android).id;
};

// Named event listener function such that it will only be attached once (anonymous event listeners may be attached mulitple times, so in casu each time initiateCollapsibles is called which messes up the functionality)
const addCollapsibleFunctionality = (event) => {
  event.target.classList.toggle('active-app-button');
  var content = event.target.nextElementSibling;
  if (content.style.display === 'block') {
    content.style.display = 'none';
  } else {
    content.style.display = 'block';
  };
};

export const initiateCollapsibles = () => {
  var coll = document.getElementsByClassName('space-details-collapsible');
  var i;
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener('click', addCollapsibleFunctionality);
  };
};

function parametersToGB(parametersStr) {
  const number = parseFloat(parametersStr);
  if (parametersStr.includes('billion')) {
    return (number * 2).toFixed(1);  // Each billion parameters is roughly 2GB
  } else if (parametersStr.includes('million')) {
    return ((number / 1000) * 2).toFixed(1);  // Convert million to billion first
  }
  return "N/A";
}
