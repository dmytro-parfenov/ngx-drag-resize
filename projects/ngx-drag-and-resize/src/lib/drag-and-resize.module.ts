import {NgModule} from '@angular/core';
import {NgxDragDirective} from './drag/drag.directive';
import {NgxDragHandleDirective} from './drag/drag-handle.directive';
import {NgxResizeDirective} from './resize/resize.directive';
import {NgxResizeHandleDirective} from './resize/resize-handle.directive';
import {SharedModule} from './shared/shared.module';

/**
 * The module provides opportunity to use drag and resize functionality on HTML elements
 *
 * @author Dmytro Parfenov <dmitryparfenov937@gmail.com>
 */
@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    NgxDragDirective,
    NgxDragHandleDirective,
    NgxResizeDirective,
    NgxResizeHandleDirective
  ],
  exports: [NgxDragDirective, NgxDragHandleDirective, NgxResizeDirective, NgxResizeHandleDirective]
})
export class NgxDragAndResizeModule { }
