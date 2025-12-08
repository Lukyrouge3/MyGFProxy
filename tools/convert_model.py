import os
import random
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader

class CaptchaCNN(nn.Module):
    def __init__(self):
        super().__init__()

        self.conv1 = nn.Conv2d(1, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.conv3 = nn.Conv2d(32, 64, 3, padding=1)

        self.pool = nn.MaxPool2d(2, 2)

        # 64x170 -> 32x85 -> 16x42 -> 8x21
        self.fc1 = nn.Linear(64 * 8 * 21, 256)
        self.fc2 = nn.Linear(256, 40)  # 4 digits × 10 classes

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = self.pool(F.relu(self.conv3(x)))

        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)

        return x.view(-1, 4, 10)

model = CaptchaCNN()
model.load_state_dict(torch.load("model/captcha_model.pt", map_location="cpu"))
model.eval()

dummy_input = torch.randn(1, 1, 64, 170)

torch.onnx.export(
    model,
    dummy_input,
    "model/captcha_model.onnx",
    input_names=["input"],
    output_names=["output"],
    opset_version=18
)

print("Exported captcha_model.onnx")

import onnx

print("Loading ONNX...")
model = onnx.load("model/captcha_model.onnx", load_external_data=True)

print("Saving as single-file ONNX...")
onnx.save_model(
    model,
    "model/captcha_model_single.onnx",
    save_as_external_data=False
)

print("✅ Packed into captcha_model_single.onnx")