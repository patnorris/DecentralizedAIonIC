import onnx
from onnxruntime.training import artifacts

# Define the model name
model_name = "model_q4"  # replace with your actual model name without the .onnx extension

# Load the onnx model.
onnx_model = onnx.load(f"training_artifacts/{model_name}.onnx")

# Define the parameters that require gradient updates
requires_grad = ["lm_head.MatMul.weight_Q4", "lm_head.MatMul.weight_scales"]

# Identify frozen parameters (those that do not require gradient updates)
frozen_params = [
   param.name
   for param in onnx_model.graph.initializer
   if param.name not in requires_grad
]

#frozen_params = ["model.layers.31.mlp.down_proj.MatMul.weight_Q4", "model.layers.31.mlp.down_proj.MatMul.weight_scales"]

print("Model inputs:")
print(len(onnx_model.graph.input))
for input in onnx_model.graph.input:
   print(input.name)

print("Model outputs:")
print(len(onnx_model.graph.output))
for output in onnx_model.graph.output:
   print(output.name)


import onnxruntime.training.onnxblock as onnxblock
import torch

class CustomCrossEntropyLoss(onnxblock.Block):
   def build(self, logits, labels):
      return torch.nn.functional.cross_entropy(logits, labels)


# Generate the training artifacts.
artifacts.generate_artifacts(
   onnx_model,
   #requires_grad=requires_grad,
   #frozen_params=frozen_params,
   #loss=artifacts.LossType.CrossEntropyLoss,
   loss=artifacts.LossType.MSELoss,
   #loss=None,
   optimizer=artifacts.OptimType.AdamW,
   artifact_directory="training_artifacts",
   #loss_input_names=["logits"],
   additional_output_names=["logits"]
)
