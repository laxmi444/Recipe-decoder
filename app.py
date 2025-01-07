from flask import Flask, request, jsonify, render_template, send_from_directory
import base64
import os
import io
import json
import logging
import requests
from PIL import Image
import tensorflow as tf
import numpy as np
import markdown

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
API_KEYS = {
    'GEMINI_API_KEY': 'AIzaSyBtaFBbyMrh7Sk7I2Bcf1e4_oH3NJt8z38'  # Replace with your actual API key
}
GEMINI_API_KEY = API_KEYS.get('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in config")

def load_class_labels():
    try:
        train_path = r"C:/Users/Omkar/PROJECTS/recipe_decoder/dataset/Indian_Food_Images"
        class_labels = sorted(os.listdir(train_path))  
        logger.info(f"Loaded {len(class_labels)} class labels")
        return class_labels
    except Exception as e:
        logger.error(f"Error loading class labels: {str(e)}")
        return []

def load_model():
    try:
        model = tf.keras.models.load_model(r"C:/Users/Omkar/PROJECTS/recipe_decoder/tf_model.keras")
        logger.info("Model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return None

def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

model = load_model()
class_labels = load_class_labels()

def predict_with_model(image):
    try:
        if not class_labels:
            logger.error("No class labels available")
            return None, 0.0
            
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        preprocessed_image = preprocess_image(image)
        
        predictions = model.predict(preprocessed_image)
        predicted_class_index = np.argmax(predictions[0])
        confidence = predictions[0][predicted_class_index]
        
        predicted_class = class_labels[predicted_class_index]
        
        logger.info(f"Model predicted {predicted_class} with confidence {confidence}")
        return predicted_class, confidence
    except Exception as e:
        logger.error(f"Error in model prediction: {str(e)}")
        return None, 0.0

def get_gemini_endpoint():
    return f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

def encode_image_to_base64(image_data):
    try:
        base64_image = base64.b64encode(image_data).decode('utf-8')
        return base64_image
    except Exception as e:
        logger.error(f"Error encoding image: {str(e)}")
        raise

def get_recipe_from_image(image_data, predicted_class=None):
    try:
        base64_image = encode_image_to_base64(image_data)
        
        prompt = """
        Look at this food image and:
        """
        if predicted_class:
            prompt += f"""
            This image has been identified as {predicted_class}, which is an Indian dish.
            Generate a detailed recipe for {predicted_class} including:
            """
        else:
            prompt += """
            1. Identify the Indian dish.
            2. Generate a detailed recipe for it including:
            """
        
        prompt += """
           - List of ingredients with measurements
           - Step-by-step cooking instructions
           - Cooking time and servings
        Format the response as JSON with the following structure:
        {
            "name": "Name of the dish",
            "description": "Brief description",
            "ingredients": ["Ingredient 1", "Ingredient 2", ...],
            "instructions": ["Step 1", "Step 2", ...],
            "prepTime": "preparation time",
            "cookTime": "cooking time",
            "servings": "number of servings"
        }
        """

        headers = {'Content-Type': 'application/json'}
        data = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64_image
                        }
                    }
                ]
            }]
        }

        response = requests.post(get_gemini_endpoint(), headers=headers, json=data)
        response.raise_for_status()
        
        response_data = response.json()
        logger.debug(f"Gemini API Response: {response_data}")

        if 'candidates' in response_data and response_data['candidates']:
            recipe_text = response_data['candidates'][0]['content']['parts'][0]['text']
            recipe_text = recipe_text.replace('json', '').replace('', '').strip()
            recipe_data = json.loads(recipe_text)
            return recipe_data
        else:
            raise ValueError("No valid response from Gemini API")

    except Exception as e:
        logger.error(f"Error generating recipe: {str(e)}")
        raise

def render_markdown(instruction):
    if instruction.strip() and instruction.strip()[0].isdigit():
        return instruction
    return markdown.markdown(instruction)

def generate_html_from_recipe(recipe_data):
    try:
        model_info = ""
        if "model_prediction" in recipe_data:
            pred = recipe_data["model_prediction"]
            model_info = f"""
            <div class="model-info">
                <h3>Model Prediction</h3>
                <p>Predicted Class: {pred['predicted_class']}</p>
                <p>Confidence: {pred['confidence']}%</p>
            </div>
            """

        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{recipe_data['name']} Recipe</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                h1 {{
                    color: #2c3e50;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 10px;
                }}
                .description {{
                    font-style: italic;
                    color: #666;
                    margin-bottom: 20px;
                }}
                .recipe-info {{
                    display: flex;
                    gap: 20px;
                    margin-bottom: 20px;
                    color: #666;
                }}
                .model-info {{
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }}
                .ingredients, .instructions {{
                    margin-bottom: 30px;
                }}
                ul, ol {{
                    padding-left: 20px;
                }}
                li {{
                    margin-bottom: 10px;
                }}
            </style>
        </head>
        <body>
            <h1>{recipe_data['name']}</h1>
            <div class="description">{recipe_data['description']}</div>
            
            {model_info}
            
            <div class="recipe-info">
                <span>Prep Time: {recipe_data['prepTime']}</span>
                <span>Cook Time: {recipe_data['cookTime']}</span>
                <span>Servings: {recipe_data['servings']}</span>
            </div>
            
            <div class="ingredients">
                <h2>Ingredients</h2>
                <ol>
                    {''.join(f'<li>{render_markdown(ingredient)}</li>' for ingredient in recipe_data['ingredients'])}
                </ol>
            
            </div>
            
            <div class="instructions">
                <h2>Instructions</h2>
        
                    {''.join(f'<p>{render_markdown(instruction)}</p>' for instruction in recipe_data['instructions'])}
            
            </div>
        </body>
        </html>
        """
        return html_template
    except Exception as e:
        logger.error(f"Error generating HTML: {str(e)}")
        raise

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    image_data = file.read()
    image = Image.open(io.BytesIO(image_data))
    
    predicted_class, confidence = predict_with_model(image)
    
    if predicted_class is None or confidence == 0.0:
        return jsonify({'error': 'Model prediction failed'}), 500
    
    return jsonify({
        'class_name': predicted_class,
        'confidence': float(confidence)
    })

@app.route('/upload', methods=['POST'])
def upload():
    try:
        logger.debug("Starting file upload processing")
        
        if 'photo' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['photo']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        image_data = file.read()
        image = Image.open(io.BytesIO(image_data))
        
        predicted_class, confidence = predict_with_model(image)
        
        if predicted_class is None or confidence == 0.0:
            logger.error("Model prediction failed")
            return jsonify({'error': 'Model prediction failed'}), 500
        
        use_prediction = confidence > 0.7
        recipe_data = get_recipe_from_image(image_data, predicted_class if use_prediction else None)
        
        recipe_name = recipe_data["name"].replace(" ", "").replace("/", "").lower()
        filename = f"{recipe_name}.html"
        
        os.makedirs('recipes', exist_ok=True)
        filepath = os.path.join('recipes', filename)
        
        if predicted_class and confidence > 0:
            recipe_data["model_prediction"] = {
                "predicted_class": predicted_class,
                "confidence": round(confidence * 100, 2)
            }
        
        html_content = generate_html_from_recipe(recipe_data)
        schema_json = json.dumps(recipe_data, indent=2)
        schema_html = f"<script type='application/ld+json'>{schema_json}</script>"
        full_html = f"{html_content}\n{schema_html}"
        
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(full_html)
        
        return jsonify({
            'message': 'Success',
            'filepath': f'/recipes/{filename}',
            'model_prediction': {
                'class': predicted_class,
                'confidence': round(confidence * 100, 2)
            } if predicted_class else None
        })
        
    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/recipes/<filename>')
def custom_static(filename):
    return send_from_directory('recipes', filename)

if __name__ == '_main_':
    app.run(debug=True)