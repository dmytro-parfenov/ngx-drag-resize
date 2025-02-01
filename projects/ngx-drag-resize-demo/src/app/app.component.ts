import {Component} from '@angular/core';
import {
  NgxDragDirective,
  NgxDragHandleDirective,
  NgxResizeDirective,
  NgxResizeHandleDirective,
  NgxResizeHandleType
} from 'ngx-drag-resize';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MatToolbar, NgxResizeDirective, NgxResizeHandleDirective, NgxDragDirective, NgxDragHandleDirective]
})
export class AppComponent {

  readonly handleType = NgxResizeHandleType;

}
