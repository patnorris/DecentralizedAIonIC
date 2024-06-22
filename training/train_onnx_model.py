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

input_names = ["input"]
output_names = ["output"]
dynamic_axes = {"input": {0: "batch_size"}, "output": {0: "batch_size"}}

onnx_model = onnx.load(f"training_artifacts/{model_name}.onnx")
print("onnx_model")

# Define the parameters that require gradient updates
#requires_grad = ["lm_head.MatMul.weight_Q4", "lm_head.MatMul.weight_scales"]

# Identify frozen parameters (those that do not require gradient updates)
""" frozen_params = [
   param.name
   for param in onnx_model.graph.initializer
   if param.name not in requires_grad
] """

#frozen_params = ["model.layers.31.mlp.down_proj.MatMul.weight_Q4", "model.layers.31.mlp.down_proj.MatMul.weight_scales"]

#requires_grad = [name for name, param in pt_model.named_parameters() if param.requires_grad]
requires_grad = []
print("requires_grad")
#frozen_params = [name for name, param in pt_model.named_parameters() if not param.requires_grad]
frozen_params = []
print("frozen_params")

print("Model inputs:")
print(len(onnx_model.graph.input))
for input in onnx_model.graph.input:
   print(input.name)

print("Model outputs:")
print(len(onnx_model.graph.output))
for output in onnx_model.graph.output:
   print(output.name)


""" class CustomCrossEntropyLoss(onnxblock.Block):
   def build(self, logits, labels):
      return torch.nn.functional.cross_entropy(logits, labels) """

output_names = ["output"]
# Generate the training artifacts.
artifacts.generate_artifacts(
   onnx_model,
   optimizer=artifacts.OptimType.AdamW,
   requires_grad=requires_grad,
   frozen_params=frozen_params,
   #loss=artifacts.LossType.CrossEntropyLoss,
   loss=artifacts.LossType.MSELoss,
   #loss=None,
   artifact_directory="training_artifacts",
   #loss_input_names=["logits"],
   #additional_output_names=["logits"]
   additional_output_names=output_names
)
