import os
import random
from flask import Flask, render_template, request, jsonify, send_file
from PIL import Image
import argparse
from test_generator import test, get_opt
from cp_dataset_test import CPDatasetTest
from networks import ConditionGenerator, load_checkpoint
from network_generator import SPADEGenerator
import base64
from io import BytesIO
import warnings
import torch
from torch.utils.data import DataLoader

warnings.filterwarnings("ignore", category=FutureWarning)

# Disable multiprocessing
torch.multiprocessing.set_sharing_strategy('file_system')

class SimpleDataLoader:
    def __init__(self, opt, dataset):
        self.opt = opt
        self.dataset = dataset
        self.data_loader = DataLoader(
            dataset,
            batch_size=opt.batch_size,
            shuffle=opt.shuffle,
            num_workers=0,  # Disable multiprocessing
            pin_memory=False
        )

app = Flask(__name__)

# Initialize test generator components
opt = get_opt()
opt.dataroot = './data'  # Set correct data root
opt.data_list = 'my_test_pairs.txt'  # Use our custom test pairs file
opt.num_workers = 0  # Set number of workers to 0
opt.batch_size = 1  # Set batch size to 1
opt.serial_batches = True  # Use serial batches

# Create initial test pairs file
pairs_file = os.path.join(opt.dataroot, opt.data_list)
with open(pairs_file, 'w') as f:
    f.write("00017_00.jpg 00641_00.jpg")  # Default pair

# Create test dataset & loader
test_dataset = CPDatasetTest(opt)
test_loader = SimpleDataLoader(opt, test_dataset)

# Initialize models with correct architecture
tocg = ConditionGenerator(opt, input1_nc=4, input2_nc=16, output_nc=13, ngf=96)
generator = SPADEGenerator(opt, 3+3+3)

# Load checkpoints
load_checkpoint(tocg, opt.tocg_checkpoint, opt)
load_checkpoint(generator, opt.gen_checkpoint, opt)

def check_required_files(person_name, cloth_name):
    """Check if all required files exist for the selected pair."""
    base_name = person_name.replace('.jpg', '')
    cloth_base = cloth_name.replace('.jpg', '')
    
    required_files = [
        f"data/test/image/{person_name}",
        f"data/test/cloth/{cloth_name}",
        f"data/test/cloth-mask/{cloth_name}",
        f"data/test/image-parse-v3/{base_name}.png",
        f"data/test/image-parse-agnostic-v3.2/{base_name}.png",
        f"data/test/openpose_img/{base_name}_rendered.png",
        f"data/test/openpose_json/{base_name}_keypoints.json",
        f"data/test/image-densepose/{base_name}.jpg"
    ]
    
    missing_files = [f for f in required_files if not os.path.exists(f)]
    return missing_files

def get_image_list(directory, count=10):
    """Get a list of image files from the directory."""
    files = os.listdir(directory)
    image_files = [f for f in files if f.endswith('.jpg')]
    return random.sample(image_files, min(count, len(image_files)))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_images')
def get_images():
    person_images = get_image_list('data/test/image')
    cloth_images = get_image_list('data/test/cloth')
    
    # Convert images to base64 for display
    person_data = []
    cloth_data = []
    
    for img_name in person_images:
        img_path = os.path.join('data/test/image', img_name)
        with Image.open(img_path) as img:
            img = img.resize((100, 150))
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            person_data.append({
                'name': img_name,
                'data': f'data:image/jpeg;base64,{img_str}'
            })
    
    for img_name in cloth_images:
        img_path = os.path.join('data/test/cloth', img_name)
        with Image.open(img_path) as img:
            img = img.resize((100, 150))
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            cloth_data.append({
                'name': img_name,
                'data': f'data:image/jpeg;base64,{img_str}'
            })
    
    return jsonify({
        'person_images': person_data,
        'cloth_images': cloth_data
    })

@app.route('/try_on', methods=['POST'])
def try_on():
    data = request.json
    person_name = data.get('person')
    cloth_name = data.get('cloth')
    
    if not person_name or not cloth_name:
        return jsonify({'error': 'Please select both a person and clothing'}), 400
    
    # Check required files
    missing_files = check_required_files(person_name, cloth_name)
    if missing_files:
        return jsonify({'error': f'Missing required files: {", ".join(missing_files)}'}), 400
    
    # Create test pairs file
    with open(pairs_file, 'w') as f:
        f.write(f"{person_name} {cloth_name}")
    
    # Recreate dataset and loader
    test_dataset = CPDatasetTest(opt)
    test_loader = SimpleDataLoader(opt, test_dataset)
    
    try:
        # Run the test generator
        test(opt, test_loader, tocg, generator)
        
        # Get the output image
        output_name = f"{person_name.replace('.jpg', '')}_{cloth_name.replace('.jpg', '')}.png"
        output_path = os.path.join('output', output_name)
        
        if os.path.exists(output_path):
            return send_file(output_path, mimetype='image/png')
        else:
            return jsonify({'error': 'Failed to generate output image'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    
    # Create the HTML template
    with open('templates/index.html', 'w') as f:
        f.write('''
<!DOCTYPE html>
<html>
<head>
    <title>Virtual Try-On</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
        }
        .image-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .image-container img {
            width: 100px;
            height: 150px;
            object-fit: cover;
            cursor: pointer;
            border: 2px solid transparent;
        }
        .image-container img.selected {
            border-color: #007bff;
        }
        .result {
            text-align: center;
            margin-top: 20px;
        }
        .result img {
            max-width: 100%;
            height: auto;
        }
        button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .error {
            color: red;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Virtual Try-On</h1>
        
        <div class="image-grid">
            <div>
                <h2>Person Images</h2>
                <div id="person-images" class="image-grid"></div>
            </div>
            <div>
                <h2>Clothing Images</h2>
                <div id="cloth-images" class="image-grid"></div>
            </div>
        </div>
        
        <div class="controls">
            <button id="try-on-btn" disabled>Try On!</button>
        </div>
        
        <div id="result" class="result"></div>
        <div id="error" class="error"></div>
    </div>

    <script>
        let selectedPerson = null;
        let selectedCloth = null;
        
        // Load images when page loads
        window.onload = async () => {
            try {
                const response = await fetch('/get_images');
                const data = await response.json();
                
                // Display person images
                const personContainer = document.getElementById('person-images');
                data.person_images.forEach(img => {
                    const div = document.createElement('div');
                    div.className = 'image-container';
                    const imgElement = document.createElement('img');
                    imgElement.src = img.data;
                    imgElement.dataset.name = img.name;
                    imgElement.onclick = () => selectPerson(img.name, imgElement);
                    div.appendChild(imgElement);
                    personContainer.appendChild(div);
                });
                
                // Display clothing images
                const clothContainer = document.getElementById('cloth-images');
                data.cloth_images.forEach(img => {
                    const div = document.createElement('div');
                    div.className = 'image-container';
                    const imgElement = document.createElement('img');
                    imgElement.src = img.data;
                    imgElement.dataset.name = img.name;
                    imgElement.onclick = () => selectCloth(img.name, imgElement);
                    div.appendChild(imgElement);
                    clothContainer.appendChild(div);
                });
            } catch (error) {
                showError('Failed to load images: ' + error.message);
            }
        };
        
        function selectPerson(name, element) {
            selectedPerson = name;
            document.querySelectorAll('#person-images img').forEach(img => img.classList.remove('selected'));
            element.classList.add('selected');
            updateTryOnButton();
        }
        
        function selectCloth(name, element) {
            selectedCloth = name;
            document.querySelectorAll('#cloth-images img').forEach(img => img.classList.remove('selected'));
            element.classList.add('selected');
            updateTryOnButton();
        }
        
        function updateTryOnButton() {
            const button = document.getElementById('try-on-btn');
            button.disabled = !(selectedPerson && selectedCloth);
        }
        
        function showError(message) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = message;
        }
        
        document.getElementById('try-on-btn').onclick = async () => {
            if (!selectedPerson || !selectedCloth) return;
            
            const button = document.getElementById('try-on-btn');
            const resultDiv = document.getElementById('result');
            const errorDiv = document.getElementById('error');
            
            button.disabled = true;
            resultDiv.innerHTML = 'Generating try-on result...';
            errorDiv.textContent = '';
            
            try {
                const response = await fetch('/try_on', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        person: selectedPerson,
                        cloth: selectedCloth
                    })
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(blob);
                    img.style.width = '300px';  // Set desired width
                    img.style.height = 'auto';
                    resultDiv.innerHTML = '';
                    resultDiv.appendChild(img);
                } else {
                    const error = await response.json();
                    showError(error.error || 'Failed to generate try-on result');
                }
            } catch (error) {
                showError('Error: ' + error.message);
            } finally {
                button.disabled = false;
            }
        };
    </script>
</body>
</html>
        ''')
    
    # Run the Flask app
    app.run(debug=False, host='localhost', port=5000) 