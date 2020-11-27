import {PositionBase} from '../position-base';

export interface MovementBase extends PositionBase {
  initial: PositionBase;
  nativeEvent: MouseEvent | TouchEvent;
}
