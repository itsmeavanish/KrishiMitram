import json
import numpy as np
from io import BytesIO
from PIL import Image
import os

from tensorflow.keras.models import load_model

def load_models(config_path="models/model_config.json"):
    """Load models and label files based on the config JSON."""
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Config not found: {config_path}")

    with open(config_path, "r") as f:
        cfg = json.load(f)

    models = {}
    for key, info in cfg.items():
        model_path = info["path"]
        labels_path = info["labels"]
        target_size = tuple(info.get("target_size", [224, 224]))

        # load model
        if not os.path.exists(model_path):
            print(f"[WARN] Model file missing for {key}: {model_path}")
            continue
        model = load_model(model_path)

        # load labels
        with open(labels_path, "r") as lf:
            labels_json = json.load(lf)
            if isinstance(labels_json, dict):
                labels = [labels_json[str(i)] for i in range(len(labels_json))]
            else:
                labels = labels_json

        models[key] = {"model": model, "labels": labels, "target_size": target_size}
        print(f"[INFO] Loaded {key} model from {model_path}")

    return models

def preprocess_image_bytes(img_bytes, target_size=(224,224)):
    """Resize and normalize image for prediction."""
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    img = img.resize((target_size[1], target_size[0]))
    arr = np.array(img).astype("float32") / 255.0
    return np.expand_dims(arr, axis=0)

def choose_model_key_from_crop(crop_name):
    """Map crop name to a model key."""
    crop_name = str(crop_name).lower()
    if "rice" in crop_name:
        return "rice"
    if "banana" in crop_name:
        return "banana"
    return "plant"
