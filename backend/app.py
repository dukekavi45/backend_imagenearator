from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
import os

app = Flask(__name__)
CORS(app)

# Use Hugging Face API (Replace with your actual token)
HF_TOKEN = os.environ.get("HF_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

@app.route("/generate-caption", methods=["POST"])
def generate_caption():
    data = request.get_json()
    img_b64 = data.get("imageBase64", "")
    
    # Clean base64 string
    if "," in img_b64:
        img_b64 = img_b64.split(",")[1]
    
    # Call Hugging Face API
    response = requests.post(API_URL, headers=headers, data=base64.b64decode(img_b64))
    
    if response.status_code != 200:
        return jsonify({"error": "AI API failed"}), 500
        
    result = response.json()
    caption = result[0].get("generated_text", "No caption found")
    
    return jsonify({"caption": caption, "style": "normal"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

# Vercel needs "app"
if __name__ == "__main__":
    app.run()
