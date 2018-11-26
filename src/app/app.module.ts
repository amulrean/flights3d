import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppCustomMaterialImportsModule} from './app-custom-material-imports.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {MapComponent} from './components/map/map.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from './state/reducers';
import {EffectsModule} from '@ngrx/effects';
import {PlanesEffects} from './state/effects/planes.effects';
import {HttpClientModule} from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

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
    EffectsModule.forRoot([PlanesEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
