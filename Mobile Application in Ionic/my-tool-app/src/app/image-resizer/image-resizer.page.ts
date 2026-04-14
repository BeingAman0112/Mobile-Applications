import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-image-resizer',
  templateUrl: './image-resizer.page.html',
  styleUrls: ['./image-resizer.page.scss'],
  standalone: false
})
export class ImageResizerPage {
  selectedImage: any = null;
  resizedImage: any = null;
  isProcessing = false;

  // Original image properties
  originalWidth = 0;
  originalHeight = 0;
  originalSizeKB = 0;

  // Resized image properties
  resizedWidth = 0;
  resizedHeight = 0;
  resizedSizeKB = 0;

  // Resize settings
  resizeMethod: 'pixels' | 'percentage' = 'pixels';
  targetWidth = 800;
  targetHeight = 600;
  keepAspectRatio = true;
  scalePercentage = 100;
  previewWidth = 0;
  previewHeight = 0;
  quality = 85;

  // Store original image as base64
  private originalImageBase64: string | null = null;
  private originalImageBlob: Blob | null = null;

  constructor() {}

  async selectImage() {
    try {
      console.log('Opening image picker...');
      
      const image = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      console.log('Image selected:', image);
      
      if (!image || !image.path) {
        console.error('No valid image path returned');
        return;
      }

      // Read the file as base64 using Filesystem
      const fileData = await Filesystem.readFile({
        path: image.path,
        directory: Directory.Data
      });

      console.log('File read successfully');
      
      // Convert base64 to blob
      const base64String = typeof fileData.data === 'string' ? fileData.data : '';
      const base64Data = 'data:image/jpeg;base64,' + base64String;
      const blob = this.base64ToBlob(base64String, 'image/jpeg');
      
      this.selectedImage = {
        webPath: base64Data,
        base64: fileData.data,
        blob: blob
      };
      
      // Load image to get dimensions
      await this.loadAndGetImageInfo(base64Data);
      
      // Reset resized image
      this.resizedImage = null;
      
      // Set initial target dimensions
      this.targetWidth = this.originalWidth;
      this.targetHeight = this.originalHeight;
      this.updatePreview();
      
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  async loadAndGetImageInfo(imageSrc: string) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.originalWidth = img.width;
        this.originalHeight = img.height;
        
        // Calculate file size from base64
        if (this.selectedImage && this.selectedImage.base64) {
          const sizeInBytes = Math.round(this.selectedImage.base64.length * 0.75);
          this.originalSizeKB = Math.round(sizeInBytes / 1024);
        }
        
        console.log(`Image loaded: ${this.originalWidth}x${this.originalHeight}`);
        resolve();
      };
      img.onerror = (err) => {
        console.error('Error loading image:', err);
        reject(err);
      };
      img.src = imageSrc;
    });
  }

  onMethodChange() {
    if (this.resizeMethod === 'percentage') {
      this.scalePercentage = 100;
      this.onPercentageChange();
    }
  }

  onWidthChange() {
    if (this.keepAspectRatio && this.originalWidth > 0) {
      const ratio = this.originalHeight / this.originalWidth;
      this.targetHeight = Math.round(this.targetWidth * ratio);
    }
    this.updatePreview();
  }

  onHeightChange() {
    if (this.keepAspectRatio && this.originalHeight > 0) {
      const ratio = this.originalWidth / this.originalHeight;
      this.targetWidth = Math.round(this.targetHeight * ratio);
    }
    this.updatePreview();
  }

  onAspectToggle() {
    if (this.keepAspectRatio) {
      const ratio = this.originalHeight / this.originalWidth;
      this.targetHeight = Math.round(this.targetWidth * ratio);
    }
    this.updatePreview();
  }

  onPercentageChange() {
    const percent = this.scalePercentage / 100;
    this.previewWidth = Math.round(this.originalWidth * percent);
    this.previewHeight = Math.round(this.originalHeight * percent);
    
    if (this.resizeMethod === 'percentage') {
      this.targetWidth = this.previewWidth;
      this.targetHeight = this.previewHeight;
    }
  }

  updatePreview() {
    if (this.resizeMethod === 'pixels') {
      this.previewWidth = this.targetWidth;
      this.previewHeight = this.targetHeight;
    }
  }

  async resizeImage() {
    if (!this.selectedImage || !this.selectedImage.base64) {
      console.error('No image selected');
      return;
    }

    this.isProcessing = true;

    try {
      console.log('Starting resize...');
      
      // Create image element from base64
      const img = await this.loadImageFromBase64(this.selectedImage.webPath);
      
      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      canvas.width = this.targetWidth;
      canvas.height = this.targetHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Draw and resize the image
      ctx.drawImage(img, 0, 0, this.targetWidth, this.targetHeight);
      
      // Convert to blob with specified quality
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b!), 
          'image/jpeg', 
          this.quality / 100
        );
      });
      
      // Convert blob to base64 for display
      const base64 = await this.blobToBase64(blob);
      
      this.resizedImage = {
        webPath: base64,
        base64: base64.split(',')[1],
        blob: blob
      };
      
      this.resizedWidth = this.targetWidth;
      this.resizedHeight = this.targetHeight;
      this.resizedSizeKB = Math.round(blob.size / 1024);
      
      console.log('Resize complete!');
      
    } catch (error) {
      console.error('Error resizing image:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private loadImageFromBase64(base64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = base64;
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  async downloadResizedImage() {
    if (!this.resizedImage || !this.resizedImage.blob) {
      console.error('No resized image available');
      return;
    }

    try {
      const fileName = `resized_${Date.now()}.jpg`;
      
      // Convert blob to base64 for Filesystem plugin
      const base64Data = await this.blobToBase64(this.resizedImage.blob);
      
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data.split(',')[1],
        directory: Directory.Documents,
        recursive: true
      });

      console.log('Image saved to:', savedFile.uri);
      
      // Show success message
      const alert = document.createElement('ion-alert');
      alert.header = 'Success!';
      alert.message = `Image saved as ${fileName}`;
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      await alert.present();
      
    } catch (error) {
      console.error('Error saving image:', error);
    }
  }
}