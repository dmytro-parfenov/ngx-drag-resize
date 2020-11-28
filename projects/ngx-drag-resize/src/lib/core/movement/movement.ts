import {PositionBase} from '../position-base';
import {Boundary} from '../../shared/boundary/boundary';

export interface Movement extends PositionBase {
  initiator: HTMLElement;
  offsetFromHost: Boundary;
  initial: PositionBase;
  nativeEvent?: Event;
}
