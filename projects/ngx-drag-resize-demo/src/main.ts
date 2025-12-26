import {enableProdMode, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';


import {environment} from './environments/environment';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AppComponent} from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),importProvidersFrom(BrowserModule, MatToolbarModule),
    provideAnimations()
  ]
})
  .catch(err => console.error(err));
