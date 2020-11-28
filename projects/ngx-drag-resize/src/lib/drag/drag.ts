import {Boundary} from '../shared/boundary/boundary';

export interface Drag extends Boundary {
  nativeEvent?: Event;
}
