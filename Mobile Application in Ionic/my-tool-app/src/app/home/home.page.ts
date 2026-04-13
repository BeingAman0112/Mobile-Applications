import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  private router = inject(Router);
  private alertController = inject(AlertController);

  // Navigate to QR Scanner page
  openQRScanner() {
    this.router.navigate(['/qr-scanner']);
  }

  // Navigate to PDF Maker page
  openPDFMaker() {
    this.router.navigate(['/pdf-maker']);
  }

  // Show coming soon alert for disabled features
  async showComingSoon() {
    const alert = await this.alertController.create({
      header: 'Coming Soon!',
      message: 'This feature is under development. Stay tuned!',
      buttons: ['OK']
    });
    await alert.present();
  }
}
