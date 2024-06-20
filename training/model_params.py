import onnx

# Define the model name
model_name = "model_q4"  # replace with your actual model name without the .onnx extension

# Load the onnx model.
onnx_model = onnx.load(f"training_artifacts/{model_name}.onnx")

# Print out all parameter names
for initializer in onnx_model.graph.initializer:
    print(initializer.name)
