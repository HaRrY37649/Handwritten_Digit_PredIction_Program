from flask import Flask, render_template, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image,ImageOps
import io

app = Flask(__name__)

#load model
model = load_model('Handwritten.keras')
def add_padding(image):
    padding = 10  # You can adjust this value
    padded_image = ImageOps.expand(image, border=padding, fill=255)
    return padded_image

@app.route('/')
def home():
    return render_template('webpage.html')

@app.route('/predict', methods=['POST'])
def predict():
    # get the images from the request
    file = request.files['image']
    image = Image.open(file.stream).convert('L')
    image = add_padding(image)
    image = ImageOps.invert(image)
    image = image.resize((28, 28))  # resize to 28*28
    image_array = np.array(image, dtype=np.float32) /255.0
    image_array = image_array.reshape(1, 28 * 28)  # flatten
    prediction = model.predict(image_array)

    digit = np.argmax(prediction)  # get the precition digit
    print(prediction, digit)
    return jsonify({'digit': int(digit)})

if __name__ == '__main__':
    app.run(debug=True)