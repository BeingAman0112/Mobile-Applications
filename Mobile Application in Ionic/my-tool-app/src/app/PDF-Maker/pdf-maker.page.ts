import { Component } from '@angular/core';
import { Camera, GalleryPhoto } from '@capacitor/camera';
import type { Content, TDocumentDefinitions, TVirtualFileSystem } from 'pdfmake/interfaces';

type PdfMakeModule = typeof import('pdfmake/build/pdfmake');

interface SelectedImage {
  webPath: string;
  base64: string;
}

@Component({
  selector: 'app-pdf-maker',
  templateUrl: './pdf-maker.page.html',
  styleUrls: ['./pdf-maker.page.scss'],
  standalone: false,
})
export class PdfMakerPage {
  selectedImages: SelectedImage[] = [];
  isGenerating = false;
  private pdfMake: PdfMakeModule | null = null;

  constructor() {
    void this.loadPdfMake();
  }

  async loadPdfMake(): Promise<void> {
    if (this.pdfMake) {
      return;
    }

    const [pdfMakeModule, pdfFontsModule] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);

    const vfs = (
      'default' in pdfFontsModule ? pdfFontsModule['default'] : pdfFontsModule
    ) as unknown as TVirtualFileSystem;

    pdfMakeModule.addVirtualFileSystem(vfs);
    this.pdfMake = pdfMakeModule;
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

        if (!photo.webPath) {
          continue;
        }

        this.selectedImages.push({
          webPath: photo.webPath,
          base64: base64Data,
        });
      }
    } catch (error) {
      console.error('Error selecting images:', error);
    }
  }

  private async readAsBase64(photo: GalleryPhoto): Promise<string> {
    if (!photo.webPath) {
      throw new Error('Selected image is missing a webPath.');
    }

    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    return this.convertBlobToBase64(blob);
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
      await this.loadPdfMake();

      if (!this.pdfMake) {
        throw new Error('PDF generator failed to initialize.');
      }

      const content: Content[] = [];

      const docDefinition: TDocumentDefinitions = {
        pageSize: 'A4',
        pageMargins: [20, 20, 20, 20],
        content
      };

      // Add each image to the PDF
      for (const image of this.selectedImages) {
        content.push({
          image: image.base64,
          width: 500,
          alignment: 'center',
          margin: [0, 10, 0, 10]
        });
      }

      // Generate PDF
      const pdfDocGenerator = this.pdfMake.createPdf(docDefinition);
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
