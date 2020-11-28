import {NgModule} from '@angular/core';
import {BoundaryDirective} from './boundary/boundary.directive';


@NgModule({
  declarations: [
    BoundaryDirective
  ],
  exports: [
    BoundaryDirective
  ]
})
export class SharedModule { }
