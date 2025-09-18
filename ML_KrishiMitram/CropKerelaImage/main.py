from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import HTMLResponse
import uvicorn
import numpy as np

from utils import load_models, preprocess_image_bytes, choose_model_key_from_crop

app = FastAPI(title="Crop Disease Prediction API")

# load models at startup (models will be auto-downloaded from S3 if missing)
MODELS = load_models("models/model_config.json")

@app.get("/")
def root():
    return {"message": "Crop Disease Prediction API running. Use /docs to test."}

@app.post("/predict")
async def predict(
    crop: str = Form(..., description="Crop name (rice/banana/plant)"),
    file: UploadFile = File(..., description="Image file")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    key = choose_model_key_from_crop(crop)
    if key not in MODELS:
        raise HTTPException(status_code=400, detail=f"No model for crop '{crop}'.")

    model_info = MODELS[key]
    img_bytes = await file.read()
    x = preprocess_image_bytes(img_bytes, target_size=model_info["target_size"])

    preds = model_info["model"].predict(x)
    preds = np.array(preds).squeeze()
    idx = int(preds.argmax())
    confidence = float(preds[idx])
    label = model_info["labels"][idx]

    return {
        "crop": crop,
        "model_used": key,
        "predicted_disease": label,
        "confidence": round(confidence, 4)
    }

@app.get("/upload", response_class=HTMLResponse)
def upload_form():
    return """
    <html>
      <body>
        <h3>Upload Image for Crop Disease Prediction</h3>
        <form action="/predict" enctype="multipart/form-data" method="post">
          Crop name: <input type="text" name="crop" value="rice"/><br/><br/>
          File: <input type="file" name="file" accept="image/*"/><br/><br/>
          <input type="submit" value="Predict"/>
        </form>
      </body>
    </html>
    """

if __name__ == "__main__":
    # 0.0.0.0 makes it work inside Docker
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
