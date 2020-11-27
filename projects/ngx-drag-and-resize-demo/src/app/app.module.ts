import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgxDragAndResizeModule} from 'ngx-drag-and-resize';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxDragAndResizeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
