import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageResizerPageRoutingModule } from './image-resizer-routing.module';

import { ImageResizerPage } from './image-resizer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageResizerPageRoutingModule
  ],
  declarations: [ImageResizerPage]
})
export class ImageResizerPageModule {}
