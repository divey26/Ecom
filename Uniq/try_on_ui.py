import os
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import random
import argparse
from test_generator import test, get_opt
from cp_dataset_test import CPDatasetTest, CPDataLoader
from networks import ConditionGenerator, load_checkpoint
from network_generator import SPADEGenerator

class TryOnUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Virtual Try-On")
        
        # Initialize test generator components
        self.opt = get_opt()
        self.opt.dataroot = './data'  # Set correct data root
        self.opt.data_list = 'my_test_pairs.txt'  # Use our custom test pairs file
        
        # Create initial test pairs file
        pairs_file = os.path.join(self.opt.dataroot, self.opt.data_list)
        with open(pairs_file, 'w') as f:
            f.write("00017_00.jpg 00641_00.jpg")  # Default pair
        
        # Create test dataset & loader
        test_dataset = CPDatasetTest(self.opt)
        self.test_loader = CPDataLoader(self.opt, test_dataset)
        
        # Initialize models with correct architecture
        self.tocg = ConditionGenerator(self.opt, input1_nc=4, input2_nc=16, output_nc=13, ngf=96)  # 4 channels for cloth+mask, 16 for pose+parse, 13 for output
        self.generator = SPADEGenerator(self.opt, 3+3+3)
        
        # Load checkpoints
        load_checkpoint(self.tocg, self.opt.tocg_checkpoint, self.opt)
        load_checkpoint(self.generator, self.opt.gen_checkpoint, self.opt)
        
        # Create main frames
        self.person_frame = ttk.LabelFrame(root, text="Person Images")
        self.person_frame.grid(row=0, column=0, padx=10, pady=5)
        
        self.cloth_frame = ttk.LabelFrame(root, text="Clothing Images")
        self.cloth_frame.grid(row=0, column=1, padx=10, pady=5)
        
        self.result_frame = ttk.LabelFrame(root, text="Result")
        self.result_frame.grid(row=1, column=0, columnspan=2, padx=10, pady=5)
        
        # Create preview frames
        self.preview_frame = ttk.LabelFrame(root, text="Preview")
        self.preview_frame.grid(row=2, column=0, columnspan=2, padx=10, pady=5)
        
        # Create preview labels
        self.result_preview = ttk.Label(self.preview_frame)
        self.result_preview.grid(row=0, column=0, padx=5, pady=5)
        
        self.grid_preview = ttk.Label(self.preview_frame)
        self.grid_preview.grid(row=0, column=1, padx=5, pady=5)
        
        # Load images
        self.person_images = self.load_images("data/test/image", 10)
        self.cloth_images = self.load_images("data/test/cloth", 10)
        
        # Create image buttons
        self.person_buttons = []
        self.cloth_buttons = []
        self.selected_person = None
        self.selected_cloth = None
        
        # Display person images
        for i, (img, path) in enumerate(self.person_images):
            btn = ttk.Button(self.person_frame, image=img, 
                           command=lambda p=path: self.select_person(p))
            btn.grid(row=i//5, column=i%5, padx=5, pady=5)
            self.person_buttons.append(btn)
        
        # Display clothing images
        for i, (img, path) in enumerate(self.cloth_images):
            btn = ttk.Button(self.cloth_frame, image=img,
                           command=lambda p=path: self.select_cloth(p))
            btn.grid(row=i//5, column=i%5, padx=5, pady=5)
            self.cloth_buttons.append(btn)
        
        # Create try-on button
        self.try_on_btn = ttk.Button(self.result_frame, text="Try On!", 
                                   command=self.run_try_on)
        self.try_on_btn.grid(row=0, column=0, padx=5, pady=5)
        
        # Status label
        self.status_label = ttk.Label(self.result_frame, text="Select a person and clothing")
        self.status_label.grid(row=0, column=1, padx=5, pady=5)
        
        # Open output folder button
        self.open_folder_btn = ttk.Button(self.result_frame, text="Open Output Folder",
                                        command=self.open_output_folder)
        self.open_folder_btn.grid(row=0, column=2, padx=5, pady=5)
    
    def check_required_files(self, person_name, cloth_name):
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
        if missing_files:
            messagebox.showerror("Error", f"Missing required files:\n" + "\n".join(missing_files))
            return False
        return True
    
    def load_images(self, directory, count):
        images = []
        files = os.listdir(directory)
        selected_files = random.sample(files, min(count, len(files)))
        
        for file in selected_files:
            if file.endswith('.jpg'):
                img_path = os.path.join(directory, file)
                img = Image.open(img_path)
                img = img.resize((100, 150))  # Resize for display
                photo = ImageTk.PhotoImage(img)
                images.append((photo, file))
        
        return images
    
    def select_person(self, path):
        self.selected_person = path
        self.update_status()
    
    def select_cloth(self, path):
        self.selected_cloth = path
        self.update_status()
    
    def update_status(self):
        if self.selected_person and self.selected_cloth:
            self.status_label.config(text=f"Selected: {self.selected_person} + {self.selected_cloth}")
        elif self.selected_person:
            self.status_label.config(text=f"Selected person: {self.selected_person}")
        elif self.selected_cloth:
            self.status_label.config(text=f"Selected clothing: {self.selected_cloth}")
    
    def open_output_folder(self):
        output_dir = os.path.join('./output', self.opt.test_name,
                                self.opt.datamode, self.opt.datasetting, 'generator')
        if os.path.exists(output_dir):
            os.startfile(output_dir)
        else:
            messagebox.showinfo("Info", "Output folder not found. Generate some results first!")
    
    def display_result(self, result_path, grid_path):
        # Display final result
        if os.path.exists(result_path):
            result_img = Image.open(result_path)
            result_img = result_img.resize((300, 450))  # Resize for display
            result_photo = ImageTk.PhotoImage(result_img)
            self.result_preview.configure(image=result_photo)
            self.result_preview.image = result_photo
        
        # Display grid image
        if os.path.exists(grid_path):
            grid_img = Image.open(grid_path)
            grid_img = grid_img.resize((600, 450))  # Resize for display
            grid_photo = ImageTk.PhotoImage(grid_img)
            self.grid_preview.configure(image=grid_photo)
            self.grid_preview.image = grid_photo
    
    def run_try_on(self):
        if not (self.selected_person and self.selected_cloth):
            self.status_label.config(text="Please select both a person and clothing")
            return
        
        # Check if all required files exist
        if not self.check_required_files(self.selected_person, self.selected_cloth):
            return
        
        # Create test pairs file in the correct location
        pairs_file = os.path.join(self.opt.dataroot, self.opt.data_list)
        with open(pairs_file, 'w') as f:
            f.write(f"{self.selected_person} {self.selected_cloth}")
        
        # Recreate dataset and loader with new pairs
        test_dataset = CPDatasetTest(self.opt)
        self.test_loader = CPDataLoader(self.opt, test_dataset)
        
        # Run try-on
        self.status_label.config(text="Generating try-on result...")
        self.root.update()
        
        try:
            # Run the test generator
            test(self.opt, self.test_loader, self.tocg, self.generator)
            
            # Get output paths
            output_dir = os.path.join('./output', self.opt.test_name,
                                    self.opt.datamode, self.opt.datasetting, 'generator')
            result_path = os.path.join(output_dir, 'output', 
                                     f"{self.selected_person.split('.')[0]}_{self.selected_cloth.split('.')[0]}.png")
            grid_path = os.path.join(output_dir, 'grid',
                                   f"{self.selected_person.split('.')[0]}_{self.selected_cloth.split('.')[0]}.png")
            
            # Display results
            self.display_result(result_path, grid_path)
            self.status_label.config(text="Try-on complete!")
        except Exception as e:
            self.status_label.config(text=f"Error: {str(e)}")

def main():
    root = tk.Tk()
    app = TryOnUI(root)
    root.mainloop()

if __name__ == "__main__":
    main() 