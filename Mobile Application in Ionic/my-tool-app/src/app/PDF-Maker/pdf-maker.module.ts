import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfMakerPageRoutingModule } from './pdf-maker-routing.module';

import { PdfMakerPage } from './pdf-maker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfMakerPageRoutingModule
  ],
  declarations: [PdfMakerPage]
})
export class PdfMakerPageModule {}
