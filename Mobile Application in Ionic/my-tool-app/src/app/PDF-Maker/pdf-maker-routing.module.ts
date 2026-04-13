import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfMakerPage } from './pdf-maker.page';

const routes: Routes = [
  {
    path: '',
    component: PdfMakerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfMakerPageRoutingModule {}
