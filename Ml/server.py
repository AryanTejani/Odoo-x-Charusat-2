import os
import torch
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from ultralytics import YOLO

app = Flask(__name__)

# Enable CORS for frontend requests
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "supports_credentials": True}})

# Load YOLOv8 model (Handle missing model file)
MODEL_PATH = "foodmodel.pt"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file '{MODEL_PATH}' not found.")
model = YOLO(MODEL_PATH)

# Load nutrition data CSV (Handle missing CSV file)
CSV_PATH = "food_nutrition.csv"
if not os.path.exists(CSV_PATH):
    raise FileNotFoundError(f"Nutrition data file '{CSV_PATH}' not found.")
nutrition_df = pd.read_csv(CSV_PATH)

# Function to get nutrition info
def get_nutrition_info(food):
    food_lower = food.lower()
    nutrition_info = nutrition_df[nutrition_df["Food Item"].str.lower() == food_lower]
    return nutrition_info.to_dict(orient="records")[0] if not nutrition_info.empty else {"message": "No nutrition data available."}

# Endpoint for image upload & food detection
@app.route("/api/tracker/detect-food", methods=["POST"])
def detect_food():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]

    # Ensure the file is an image
    try:
        image = Image.open(image_file).convert("RGB")
    except:
        return jsonify({"error": "Invalid image format"}), 400

    # Run YOLO model on the image
    results = model(image)
    detected_foods = list(set(model.names[int(box.cls)] for r in results for box in r.boxes))  # Remove duplicates

    if not detected_foods:
        return jsonify({"error": "No food detected"}), 400  # Return proper error if no fod is found

    # Fetch nutrition info for detected foods
    output = [{"food": food, "nutrition": get_nutrition_info(food)} for food in detected_foods]

    return jsonify({"data": output})

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=3000)
