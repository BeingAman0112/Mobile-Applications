import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageResizerPage } from './image-resizer.page';

const routes: Routes = [
  {
    path: '',
    component: ImageResizerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageResizerPageRoutingModule {}
