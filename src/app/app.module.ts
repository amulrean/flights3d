import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppCustomMaterialImportsModule} from './app-custom-material-imports.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MapComponent} from './map/map.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppCustomMaterialImportsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
