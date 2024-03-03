const availableAiModels = [
  {
    id: 'RedPajama-INCITE-Chat-3B-v1-q4f32_1',
    name: 'Red Pajama',
    size: 'Medium',
    numberOfParameters: '3 billion',
    performance: 'Alright',
    default: true
  },
  { //requires shader-f16
    id: 'Mistral-7B-Instruct-v0.2-q4f16_1',
    name: 'Mistral',
    size: 'Large',
    numberOfParameters: '7 billion',
    performance: 'Very Good',
    default: false
  },
  {
    id: 'gemma-2b-it-q4f32_1',
    name: 'Gemma',
    size: 'Smaller',
    numberOfParameters: '2 billion',
    performance: 'Good',
    default: false
  },
  {
    id: 'TinyLlama-1.1B-Chat-v0.4-q0f32',
    name: 'TinyLlama',
    size: 'Small',
    numberOfParameters: '1.1 billion',
    performance: 'Alright',
    default: false
  },
  { //requires shader-f16
    id: 'Llama-2-13b-chat-hf-q4f16_1',
    name: 'Llama2 13b',
    size: 'Very Large',
    numberOfParameters: '13 billion',
    performance: 'Super Good',
    default: false
  },
  { //requires shader-f16
    id: 'Llama-2-70b-chat-hf-q4f16_1',
    name: 'Llama2 70b',
    size: 'Gigantic',
    numberOfParameters: '70 billion',
    performance: 'Insane',
    default: false
  },
  // Android WebGPU models
  {
    id: 'RedPajama-INCITE-Chat-3B-v1-q4f32_1-1k',
    name: 'Red Pajama',
    size: 'Medium',
    numberOfParameters: '3 billion',
    performance: 'Alright',
    default: true,
    android: true
  },
  {
    id: 'Phi2-q4f32_1-1k',
    name: 'Phi',
    size: 'Smaller',
    numberOfParameters: '2 billion',
    performance: 'Good',
    default: false,
    android: true
  },
  /* {
    id: 'gemma-2b-it-q4f32_1-1k',
    name: 'Gemma',
    size: 'Smaller',
    numberOfParameters: '2 billion',
    performance: 'Good',
    default: false,
    android: true
  },
  {
    id: 'TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k',
    name: 'TinyLlama',
    size: 'Small',
    numberOfParameters: '1.1 billion',
    performance: 'Alright',
    default: false,
    android: true
  },
  {
    id: 'Phi1.5-q4f32_1-1k',
    name: 'Phi',
    size: 'Small',
    numberOfParameters: '1.5 billion',
    performance: 'Alright',
    default: false,
    android: true
  },
  { //requires shader-f16
    id: 'Llama-2-7b-chat-hf-q4f16_1-1k',
    name: 'Llama2 7b',
    size: 'Large',
    numberOfParameters: '7 billion',
    performance: 'Very Good',
    default: false,
    android: true
  }, */
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
