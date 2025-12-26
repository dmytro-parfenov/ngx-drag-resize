import {enableProdMode, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';


import {environment} from './environments/environment';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AppComponent} from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(), importProvidersFrom(BrowserModule, MatToolbarModule)
  ]
})
  .catch(err => console.error(err));
