import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform, IonicModule } from '@ionic/angular';

declare let pdfMake: any;

@Component({
  selector: 'app-pdf-maker',
  templateUrl: './pdf-maker.page.html',
  styleUrls: ['./pdf-maker.page.scss'],
  standalone: false,
})
export class PdfMakerPage {
  selectedImages: any[] = [];
  isGenerating = false;

  constructor(private platform: Platform) {
    this.loadPdfMake();
  }

  async loadPdfMake() {
    // Dynamically import pdfmake
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    pdfMake = pdfMakeModule.default;
    pdfMake.vfs = pdfFontsModule.default['pdfMake'].vfs;
  }

  async selectImages() {
    try {
      const result = await Camera.pickImages({
        quality: 90,
        limit: 10
      });

      for (const photo of result.photos) {
        // Convert to base64 for PDF generation
        const base64Data = await this.readAsBase64(photo);

        this.selectedImages.push({
          webPath: photo.webPath,
          base64: base64Data
        });
      }
    } catch (error) {
      console.error('Error selecting images:', error);
    }
  }

  private async readAsBase64(photo: Photo) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  async generatePDF() {
    if (this.selectedImages.length === 0) return;

    this.isGenerating = true;

    try {
      // Prepare document definition for pdfmake
      const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [20, 20, 20, 20],
        content: []
      };

      // Add each image to the PDF
      for (const image of this.selectedImages) {
        docDefinition.content.push({
          image: image.base64,
          width: 500,
          alignment: 'center',
          margin: [0, 10, 0, 10]
        });
      }

      // Generate PDF
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      // Download the PDF
      pdfDocGenerator.download(`document-${Date.now()}.pdf`);

      // Clear images after successful generation
      this.selectedImages = [];

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      this.isGenerating = false;
    }
  }
}
