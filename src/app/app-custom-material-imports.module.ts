import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    // MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    // MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule
  ],
  declarations: []
})
export class AppCustomMaterialImportsModule {}
