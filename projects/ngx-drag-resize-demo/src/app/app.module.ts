import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgxDragResizeModule} from 'ngx-drag-resize';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxDragResizeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
