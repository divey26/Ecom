# HR-VITON: High-Resolution Virtual Try-On

A virtual try-on application that allows users to visualize how clothing items would look on different people using deep learning.

## Features

- Interactive GUI for selecting person and clothing images
- Real-time virtual try-on generation
- High-resolution output results
- Support for multiple clothing items and person images

## Requirements

- Python 3.7+
- PyTorch
- CUDA (for GPU acceleration)
- Other dependencies listed in requirements.txt

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/HR-VITON.git
cd HR-VITON
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Download the pre-trained models and place them in the appropriate directories.

## Usage

Run the application:
```bash
python try_on_ui.py
```

1. Select a person image from the left panel
2. Select a clothing item from the right panel
3. Click "Try On!" to generate the result
4. View the generated output in the preview window

## Project Structure

```
HR-VITON/
├── data/               # Dataset directory
├── networks/          # Neural network architectures
├── output/            # Generated results
├── try_on_ui.py      # Main GUI application
├── test_generator.py  # Test generation module
└── requirements.txt   # Project dependencies
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on the HR-VITON architecture
- Uses pre-trained models for pose estimation and parsing
