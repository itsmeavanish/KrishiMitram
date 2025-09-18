import json
import numpy as np
from io import BytesIO
from PIL import Image
import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

from tensorflow.keras.models import load_model

# Initialize S3 client once
s3_client = boto3.client("s3")

def download_from_s3(bucket, key, save_path):
    """Download file from S3 if not already present."""
    if not os.path.exists(save_path):
        try:
            print(f"[INFO] Downloading {key} from S3 bucket {bucket}...")
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            s3_client.download_file(bucket, key, save_path)
            print(f"[INFO] Saved to {save_path}")
        except NoCredentialsError:
            raise RuntimeError("❌ AWS credentials not found. Configure with `aws configure` or env vars.")
        except ClientError as e:
            raise RuntimeError(f"❌ Failed to download {key} from {bucket}: {e}")
    else:
        print(f"[INFO] File already exists locally: {save_path}")


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

        # Download model from S3 if missing
        if not os.path.exists(model_path):
            if "bucket" in info and "s3_key" in info:
                download_from_s3(info["bucket"], info["s3_key"], model_path)
            else:
                print(f"[WARN] Model file missing and no S3 info for {key}: {model_path}")
                continue

        # Load model
        print(f"[INFO] Loading model for {key}...")
        model = load_model(model_path)

        # Load labels (local file)
        with open(labels_path, "r") as lf:
            labels_json = json.load(lf)
            if isinstance(labels_json, dict):
                labels = [labels_json[str(i)] for i in range(len(labels_json))]
            else:
                labels = labels_json

        models[key] = {"model": model, "labels": labels, "target_size": target_size}
        print(f"[INFO] ✅ Loaded {key} model from {model_path}")

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
