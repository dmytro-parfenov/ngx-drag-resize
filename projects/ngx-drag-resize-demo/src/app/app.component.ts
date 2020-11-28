import {Component} from '@angular/core';
import {NgxHandleType} from 'ngx-drag-resize';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly handleType = NgxHandleType;

}
