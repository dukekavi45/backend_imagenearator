"""
Image Caption Generator - Flask Backend
Uses Hugging Face ViT-GPT2 model for image captioning
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from PIL import Image
import io
import base64
import os
import json

# ── App setup ──────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# SQLite database for caption history
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///captions.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# ── Database Model ──────────────────────────────────────────────────────────
class CaptionHistory(db.Model):
    """Stores generated captions with metadata."""
    id          = db.Column(db.Integer, primary_key=True)
    caption     = db.Column(db.Text, nullable=False)
    style       = db.Column(db.String(50), nullable=False)
    image_name  = db.Column(db.String(255))
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":         self.id,
            "caption":    self.caption,
            "style":      self.style,
            "imageName":  self.image_name,
            "createdAt":  self.created_at.isoformat(),
        }

# ── Lazy model loader ───────────────────────────────────────────────────────
_model     = None
_processor = None
_tokenizer = None

def get_model():
    """Load the ViT-GPT2 captioning model once, then cache it."""
    global _model, _processor, _tokenizer
    if _model is None:
        from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
        import torch

        MODEL_ID = "nlpconnect/vit-gpt2-image-captioning"
        print("⏳ Loading ViT-GPT2 model …")
        _processor = ViTImageProcessor.from_pretrained(MODEL_ID)
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        _model     = VisionEncoderDecoderModel.from_pretrained(MODEL_ID)
        _model.eval()
        print("✅ Model loaded.")
    return _model, _processor, _tokenizer

# ── Caption helpers ─────────────────────────────────────────────────────────
def generate_base_caption(image: Image.Image) -> str:
    """Run the vision model and return a raw caption string."""
    import torch
    model, processor, tokenizer = get_model()

    if image.mode != "RGB":
        image = image.convert("RGB")

    pixel_values = processor(images=image, return_tensors="pt").pixel_values

    with torch.no_grad():
        output_ids = model.generate(
            pixel_values,
            max_length=64,
            num_beams=4,
            early_stopping=True,
        )

    caption = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return caption.strip()


def style_caption(base: str, style: str) -> str:
    """Transform the base caption into the requested style."""
    if style == "normal":
        return base.capitalize()

    if style == "instagram":
        # Add relevant emojis and a hashtag block
        emojis = "✨📸🌟💫🎯"
        tags   = "#photography #photooftheday #instagood #vibes #aesthetic #capture #moment"
        return f"{emojis} {base.capitalize()} {emojis}\n\n{tags}"

    if style == "funny":
        twists = [
            f"POV: {base} … and nobody asked 😭",
            f"No one:\nAbsolutely no one:\nThis photo: {base} 💀",
            f"My therapist told me to describe my feelings. So: {base}. She wasn't ready. 😂",
            f"Breaking news 🗞️: {base}. Experts baffled.",
            f"Scientists have discovered {base}. Society will never recover 🤣",
        ]
        import random
        return random.choice(twists)

    return base  # fallback


# ── Routes ──────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Caption API is running 🚀"})


@app.route("/generate-caption", methods=["POST"])
def generate_caption():
    """
    Accepts: multipart/form-data  — field 'image' (file) + 'style' (string)
             OR application/json  — { imageBase64, style, imageName }
    Returns: { caption, style, imageName }
    """
    try:
        style      = "normal"
        image_name = "uploaded_image"
        image      = None

        # ── Parse request ──
        if request.content_type and "multipart" in request.content_type:
            if "image" not in request.files:
                return jsonify({"error": "No image file provided"}), 400
            file       = request.files["image"]
            style      = request.form.get("style", "normal")
            image_name = file.filename or image_name
            image      = Image.open(file.stream)

        else:  # JSON / base64
            data          = request.get_json(force=True)
            style         = data.get("style", "normal")
            image_name    = data.get("imageName", image_name)
            b64           = data.get("imageBase64", "")
            # Strip optional data-URL prefix
            if "," in b64:
                b64 = b64.split(",", 1)[1]
            image_bytes   = base64.b64decode(b64)
            image         = Image.open(io.BytesIO(image_bytes))

        # ── Generate ──
        base    = generate_base_caption(image)
        caption = style_caption(base, style)

        # ── Persist to history ──
        record = CaptionHistory(
            caption    = caption,
            style      = style,
            image_name = image_name,
        )
        db.session.add(record)
        db.session.commit()

        return jsonify({
            "caption":   caption,
            "style":     style,
            "imageName": image_name,
        })

    except Exception as exc:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


@app.route("/history", methods=["GET"])
def get_history():
    """Return the 20 most recent caption records."""
    records = CaptionHistory.query.order_by(CaptionHistory.created_at.desc()).limit(20).all()
    return jsonify([r.to_dict() for r in records])


@app.route("/history/<int:record_id>", methods=["DELETE"])
def delete_history(record_id):
    """Delete a caption history record by ID."""
    record = CaptionHistory.query.get_or_404(record_id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"})


# ── Bootstrap ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        print("✅ Database ready.")
    app.run(debug=True, host="0.0.0.0", port=5000)
