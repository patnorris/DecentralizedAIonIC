from onnxruntime.training import artifacts
import torch
import onnx
import io
#import netron
print("let's go")
# Pytorch class that we will use to generate the graphs.
class MNISTNet(torch.nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(MNISTNet, self).__init__()

        self.fc1 = torch.nn.Linear(input_size, hidden_size)
        self.relu = torch.nn.ReLU()
        self.fc2 = torch.nn.Linear(hidden_size, num_classes)

    def forward(self, model_input):
        out = self.fc1(model_input)
        out = self.relu(out)
        out = self.fc2(out)
        return out

# Create a MNISTNet instance.
device = "cpu"
batch_size, input_size, hidden_size, output_size = 64, 784, 500, 10
pt_model = MNISTNet(input_size, hidden_size, output_size).to(device)
print("pt_model")

# Generate a random input.
model_inputs = (torch.randn(batch_size, input_size, device=device),)
print("model_inputs")

input_names = ["input"]
output_names = ["output"]
dynamic_axes = {"input": {0: "batch_size"}, "output": {0: "batch_size"}}

f = io.BytesIO()
print("f")
torch.onnx.export(
    pt_model,
    model_inputs,
    f,
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
onnx_model = onnx.load_model_from_string(f.getvalue())
print("onnx_model")

requires_grad = [name for name, param in pt_model.named_parameters() if param.requires_grad]
print("requires_grad")
frozen_params = [name for name, param in pt_model.named_parameters() if not param.requires_grad]
print("frozen_params")
artifacts.generate_artifacts(
    onnx_model,
    optimizer=artifacts.OptimType.AdamW,
    loss=artifacts.LossType.CrossEntropyLoss,
    requires_grad=requires_grad,
    frozen_params=frozen_params,
    additional_output_names=output_names)
print("artifacts")
#netron.start("eval_model.onnx")