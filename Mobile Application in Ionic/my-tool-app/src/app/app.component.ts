import { Component } from '@angular/core';
import { AdMob } from '@capacitor-community/admob';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    // Initialize AdMob when app starts
    await AdMob.initialize();
    console.log('AdMob ready');
  }
}
