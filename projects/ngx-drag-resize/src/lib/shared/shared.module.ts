import {NgModule} from '@angular/core';
import {BoundaryDirective} from './boundary/boundary.directive';


/**
 * @internal
 */
@NgModule({
  declarations: [
    BoundaryDirective
  ],
  exports: [
    BoundaryDirective
  ]
})
export class SharedModule { }
