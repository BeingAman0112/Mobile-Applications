import { Component } from '@angular/core';
import { AdMob } from '@capacitor-community/admob';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  scannedData: string = 'No scan yet.';
  scanCount: number = 0;

  constructor() {}

  async startScan() {
    try {
      await BarcodeScanner.checkPermission({ force: true });
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scannedData = result.content;
        this.scanCount++;

        // Show ad every 3 scans
        if (this.scanCount === 3) {
          // Use test IDs first!
          await AdMob.prepareInterstitial({
            adId: 'ca-app-pub-3940256099942544/1033173712' // Test ad ID
          });
          await AdMob.showInterstitial();
          this.scanCount = 0;
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
