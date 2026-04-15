import { Component } from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeAdMob();
  }

  async initializeAdMob() {
    try {
        // Initialize with minimal options first
        await AdMob.initialize({  // Not needed for Android
        });

        // Wait for the UI to be ready
        setTimeout(() => {
            this.showBanner();
        }, 2000);

    } catch (error) {
        console.error('AdMob init error:', error);
        // Don't crash - the app continues without ads
    }
}

async showBanner() {
    try {
        const options: BannerAdOptions = {
            adId: 'ca-app-pub-9207186764337643/8436867175',
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: true,  // Keep as true until it works
        };

        await AdMob.showBanner(options);
        console.log('Banner showing');

    } catch (error) {
        console.error('Banner error:', error);
    }
}
}
