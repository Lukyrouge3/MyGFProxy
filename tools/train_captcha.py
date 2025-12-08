import os
import random
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader

# -----------------------
# CONFIG
# -----------------------

IMAGE_W = 170
IMAGE_H = 64
BATCH_SIZE = 32
EPOCHS = 15
LR = 0.001

DATA_DIR = "captchas/bins"
TRAIN_RATIO = 0.8

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# -----------------------
# DATASET
# -----------------------

class CaptchaDataset(Dataset):
    def __init__(self, files):
        self.files = files

    def __len__(self):
        return len(self.files)

    def __getitem__(self, idx):
        path = self.files[idx]
        filename = os.path.basename(path)

        # label from filename: timestamp_3677.bin
        label_str = filename.split("_")[1].replace(".bin", "")
        label = torch.tensor([int(c) for c in label_str], dtype=torch.long)

        # raw grayscale buffer
        img = np.fromfile(path, dtype=np.uint8)

        # reshape to (64, 170)
        img = img.reshape(64, 170).astype(np.float32) / 255.0

        img = torch.tensor(img).unsqueeze(0)

        return img, label


# -----------------------
# MODEL
# -----------------------

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

# -----------------------
# LOAD & SPLIT DATA
# -----------------------

all_images = [
    os.path.join(DATA_DIR, f)
    for f in os.listdir(DATA_DIR)
    if f.endswith(".bin")
]

random.shuffle(all_images)

split_index = int(len(all_images) * TRAIN_RATIO)
train_files = all_images[:split_index]
val_files = all_images[split_index:]

train_dataset = CaptchaDataset(train_files)
val_dataset = CaptchaDataset(val_files)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)

print(f"Train samples: {len(train_dataset)}")
print(f"Val samples:   {len(val_dataset)}")

print("Sample file:", train_files[0])
img, label = train_dataset[0]
print("Parsed label tensor:", label)


# -----------------------
# TRAINING SETUP
# -----------------------

model = CaptchaCNN().to(DEVICE)
optimizer = optim.Adam(model.parameters(), lr=LR)
criterion = nn.CrossEntropyLoss()

# -----------------------
# TRAIN LOOP
# -----------------------
best_full = 0.0
for epoch in range(EPOCHS):
    model.train()
    total_loss = 0

    for imgs, labels in train_loader:
        imgs = imgs.to(DEVICE)
        labels = labels.to(DEVICE)

        out = model(imgs)

        loss = sum(
            criterion(out[:, i], labels[:, i])
            for i in range(4)
        )

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{EPOCHS} - Loss: {total_loss:.4f}")

    # -----------------------
    # VALIDATION
    # -----------------------

    model.eval()
    correct_full = 0
    correct_digits = 0
    total_digits = 0
    total = 0

    with torch.no_grad():
        for imgs, labels in val_loader:
            imgs = imgs.to(DEVICE)
            labels = labels.to(DEVICE)

            out = model(imgs)
            preds = out.argmax(dim=2)

            for p, t in zip(preds, labels):
                # Full-captcha accuracy
                if torch.all(p == t):
                    correct_full += 1

                # Per-digit accuracy
                correct_digits += (p == t).sum().item()
                total_digits += 4
                total += 1

    full_acc = correct_full / total
    digit_acc = correct_digits / total_digits

    if full_acc > best_full:
        best_full = full_acc
        torch.save(model.state_dict(), "captcha_model.pt")
        print("Model saved as captcha_model.pt")

    print(f"Validation Full Captcha Accuracy: {full_acc * 100:.2f}%")
    print(f"Validation Per-Digit Accuracy:     {digit_acc * 100:.2f}%\n")


# -----------------------
# SAVE MODEL
# -----------------------

# torch.save(model.state_dict(), "captcha_model.pt")
# print("Model saved as captcha_model.pt")
