import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
  standalone: false
})
export class QrScannerPage {
  scannedData: string = 'No scan yet.';
  scanCount: number = 0;

  constructor() {}

  async startScan() {
    try {
      const granted = await BarcodeScanner.requestPermissions();

      if (granted.camera === 'granted') {
        const { barcodes } = await BarcodeScanner.scan();

        if (barcodes && barcodes.length > 0) {
          this.scannedData = barcodes[0].rawValue ?? 'Unknown barcode';
          this.scanCount++;

          // Show ad every 3 scans
          if (this.scanCount === 3) {
            await AdMob.prepareInterstitial({
              adId: 'ca-app-pub-9207186764337643/8436867175'
            });
            await AdMob.showInterstitial();
            this.scanCount = 0;
          }
        }
      } else {
        this.scannedData = 'Camera permission denied';
      }
    } catch (error) {
      console.error('Error:', error);
      this.scannedData = 'Scanning failed';
    }
  }
}
