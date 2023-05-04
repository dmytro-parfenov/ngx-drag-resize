import {Boundary} from '../shared/boundary/boundary';

export interface NgxDrag extends Boundary {
  nativeEvent?: Event;
  positionBasedOnBoundary?: {left: number, top: number}
}
