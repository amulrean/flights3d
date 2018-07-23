import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppCustomMaterialImportsModule} from './app-custom-material-imports.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MapComponent} from './map/map.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from './reducers';
import {EffectsModule} from '@ngrx/effects';
import {PlanesEffects} from './effects/planes.effects';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppCustomMaterialImportsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([PlanesEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
