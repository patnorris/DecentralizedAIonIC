import onnx
from onnxruntime.training import artifacts
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, set_seed
import io
import onnxruntime.training.onnxblock as onnxblock

# Define the model name
model_name = "exported_model"  # replace with your actual model name without the .onnx extension

# Set a seed for reproducibility
set_seed(2024)

# Define the model checkpoint simply replace with Phi-3 Model Required
model_checkpoint = "microsoft/Phi-3-mini-4k-instruct"

# Load the tokenizer from the model checkpoint
# trust_remote_code=True allows the execution of code from the model files
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint,trust_remote_code=True)

# Load the model from the model checkpoint
# trust_remote_code=True allows the execution of code from the model files
# torch_dtype="auto" automatically determines the appropriate torch.dtype
# device_map="cuda" specifies that the model should be loaded to the GPU
pt_model = AutoModelForCausalLM.from_pretrained(model_checkpoint,
                                             trust_remote_code=True,
                                             torch_dtype="auto",
                                             device_map="cpu")

model_inputs = tokenizer("This is a test input", return_tensors="pt").to("cpu")
print("model_inputs")

input_names = ["input"]
output_names = ["output"]
dynamic_axes = {"input": {0: "batch_size"}, "output": {0: "batch_size"}}

f = io.BytesIO()
print("f")
torch.onnx.export(
    pt_model,
    (model_inputs["input_ids"],),
    f"training_artifacts/{model_name}.onnx",
    input_names=input_names,
    output_names=output_names,
    opset_version=14,
    do_constant_folding=False,
    training=torch.onnx.TrainingMode.TRAINING,
    dynamic_axes=dynamic_axes,
    export_params=True,
    keep_initializers_as_inputs=False,
)
print("export")
#onnx_model = onnx.load_model_from_string(f.getvalue())
