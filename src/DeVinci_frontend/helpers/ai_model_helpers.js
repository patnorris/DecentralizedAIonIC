const availableAiModels = [
  { //requires shader-f16
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama3.2 1B',
    size: 'Very Small',
    parameters: '1 billion',
    performance: 'Good',
    goodFor: 'English',
    default: false
  },
  { //requires shader-f16
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    name: 'Llama3.2 3B',
    size: 'Medium',
    parameters: '3 billion',
    performance: 'Very Good',
    goodFor: 'English',
    default: false
  },
  { //requires shader-f16
    id: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    name: 'Llama3.1 8B',
    size: 'Large',
    parameters: '8 billion',
    performance: 'Super Good',
    goodFor: 'English, German, French, Italian, Portuguese, Hindi, Spanish, Thai',
    default: false
  },
  { //requires shader-f16
    id: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
    name: 'Phi3.5',
    size: 'Medium',
    parameters: '3.8 billion',
    performance: 'Very Good',
    goodFor: 'German, English, Spanish, French, Japanese, Russian, Thai, Chinese, Dutch, Ukrainian',
    default: false
  },
  { //requires shader-f16
    id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
    name: 'SmolLM 2 1.7B',
    size: 'Small',
    parameters: '1.7 billion',
    performance: 'Good',
    goodFor: 'English',
    default: false
  },
  { //requires shader-f16
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    name: 'SmolLM 2 360M',
    size: 'Very Small',
    parameters: '360 million',
    performance: 'Quite Good',
    goodFor: 'English',
    default: false
  },
  { //requires shader-f16
    id: 'SmolLM2-135M-Instruct-q0f16-MLC',
    name: 'SmolLM 2 135M',
    size: 'Super Small',
    parameters: '135 million',
    performance: 'Alright',
    goodFor: 'English',
    default: false
  },
  { //requires shader-f16
    id: 'gemma-2-2b-it-q4f16_1-MLC',
    name: 'Gemma 2 2B',
    size: 'Small',
    parameters: '2 billion',
    performance: 'Good',
    goodFor: 'English',
    default: true
  },
  { //requires shader-f16
    id: 'gemma-2-2b-jpn-it-q4f16_1-MLC',
    name: 'Gemma 2 Jpn',
    size: 'Small',
    parameters: '2 billion',
    performance: 'Good',
    goodFor: 'Japanese',
    default: false
  },
  { //requires shader-f16
    id: 'gemma-2-9b-it-q4f16_1-MLC',
    name: 'Gemma 2 9B',
    size: 'Large',
    parameters: '9 billion',
    performance: 'Super Good',
    goodFor: 'English',
    default: false
  },
  { //requires shader-f16
    id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 0.5B',
    size: 'Very Small',
    parameters: '0.5 billion',
    performance: 'Quite Good',
    goodFor: 'Chinese, English, Japanese, Korean, Vietnamese, Thai, Arabic, French, Spanish, Portuguese, German, Italian, Russian',
    default: false
  },
  { //requires shader-f16
    id: "Qwen2.5-1.5B-Instruct-q4f32_1-MLC",
    name: 'Qwen2.5 1.5B',
    size: 'Small',
    parameters: '1.5 billion',
    performance: 'Good',
    goodFor: 'Chinese, English, Japanese, Korean, Vietnamese, Thai, Arabic, French, Spanish, Portuguese, German, Italian, Russian',
    default: false
  },
  { //requires shader-f16
    id: "Qwen2.5-7B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 7B',
    size: 'Large',
    parameters: '7 billion',
    performance: 'Very Good',
    goodFor: 'Chinese, English, Japanese, Korean, Vietnamese, Thai, Arabic, French, Spanish, Portuguese, German, Italian, Russian',
    default: false
  },
  { //requires shader-f16
    id: "Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 Coder 1.5B',
    size: 'Small',
    parameters: '1.5 billion',
    performance: 'Good',
    goodFor: 'Coding',
    default: false
  },
  { //requires shader-f16
    id: "Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 Coder 7B',
    size: 'Large',
    parameters: '7 billion',
    performance: 'Very Good',
    goodFor: 'Coding',
    default: false
  },
  { //requires shader-f16
    id: "Qwen2.5-Math-1.5B-Instruct-q4f16_1-MLC",
    name: 'Qwen2.5 Math',
    size: 'Small',
    parameters: '1.5 billion',
    performance: 'Good',
    goodFor: 'Math',
    default: false
  },
  { //requires shader-f16
    id: 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC',
    name: 'TinyLlama',
    size: 'Very Small',
    parameters: '1.1 billion',
    performance: 'Alright',
    goodFor: 'English',
    default: false
  },
  { //requires shader-f16
    id: 'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
    name: 'Mistral',
    size: 'Large',
    parameters: '7 billion',
    performance: 'Very Good',
    goodFor: 'English',
    default: false
  },
  { //requires shader-f16
    id: 'WizardMath-7B-V1.1-q4f16_1-MLC',
    name: 'WizardMath',
    size: 'Large',
    parameters: '7 billion',
    performance: 'Very Good',
    goodFor: 'Math',
    default: false
  },
  { //requires shader-f16
    id: 'Llama-3.1-70B-Instruct-q3f16_1-MLC',
    name: 'Llama3.1 70B',
    size: 'Gigantic',
    parameters: '70 billion',
    performance: 'Insane',
    goodFor: 'English, German, French, Italian, Portuguese, Hindi, Spanish, Thai',
    default: false
  },
// Android WebGPU models
  {
    model: "https://huggingface.co/mlc-ai/Qwen2-1.5B-Instruct-q4f32_1-MLC",
    id: "Qwen2-1.5B-Instruct-q4f32_1-MLC",
    name: 'Qwen2 1.5B',
    size: 'Tiny',
    parameters: '1.5 billion',
    performance: 'Good',
    goodFor: 'Chinese, English',
    default: true,
    android: true
  },
  {
    id: 'Llama-3.1-8B-Instruct-q4f32_1-MLC-1k',
    name: 'Llama3.1 8B',
    size: 'Large',
    parameters: '8 billion',
    performance: 'Super Good',
    goodFor: 'English, German, French, Italian, Portuguese, Hindi, Spanish, Thai',
    default: false,
    android: true
  },
  {
    id: 'Phi-3.5-mini-instruct-q4f32_1-MLC-1k',
    name: 'Phi3.5',
    size: 'Medium',
    parameters: '3.8 billion',
    performance: 'Very Good',
    goodFor: 'German, English, Spanish, French, Japanese, Russian, Thai, Chinese, Dutch, Ukrainian',
    default: false,
    android: true
  },
  {
    id: 'SmolLM-1.7B-Instruct-q4f32_1-MLC',
    name: 'SmolLM 1.7B',
    size: 'Small',
    parameters: '1.7 billion',
    performance: 'Good',
    goodFor: 'English',
    default: false,
    android: true
  },
  {
    id: 'gemma-2-2b-it-q4f32_1-MLC-1k',
    name: 'Gemma 2',
    size: 'Small',
    parameters: '2 billion',
    performance: 'Good',
    goodFor: 'English',
    default: false,
    android: true
  },
  {
    id: 'TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC-1k',
    name: 'TinyLlama',
    size: 'Small',
    parameters: '1.1 billion',
    performance: 'Alright',
    goodFor: 'English',
    default: false,
    android: true
  },
  {
    id: 'RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC-1k',
    name: 'Red Pajama',
    size: 'Medium',
    parameters: '3 billion',
    performance: 'Alright',
    goodFor: 'English',
    default: false,
    android: true
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
